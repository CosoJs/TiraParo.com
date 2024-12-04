import { Component, OnInit } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs } from '@angular/fire/firestore';
import { getStorage, ref, getDownloadURL } from '@angular/fire/storage';
import { MatDialog } from '@angular/material/dialog';
import { ModalordenesdeservicioComponent } from '../modalordenesdeservicio/modalordenesdeservicio.component';

@Component({
  selector: 'app-ordenes',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdenesComponent implements OnInit {
  misOrdenes: any[] = [];
  misOrdenesCompletadas: any[] = [];
  isSidebarExpanded: boolean = false;
  userId: string = '';
  storage = getStorage(); // Servicio de almacenamiento Firebase

  constructor(private firestore: Firestore, public dialog: MatDialog) {}

  ngOnInit() {
    this.userId = localStorage.getItem('UsuarioId') || '';
    if (this.userId) {
      this.cargarMisOrdenes(this.userId);
    } else {
      console.error('UsuarioId no encontrado en localStorage.');
    }
  }

  async cargarMisOrdenes(userId: string) {
    const reservasRef = collection(this.firestore, `users/${userId}/reservas`);
    const querySnapshot = await getDocs(reservasRef);
    for (const docSnapshot of querySnapshot.docs) {
      const ordenData = docSnapshot.data();
      const ordenId = docSnapshot.id;

      // Obtener la URL de la imagen
      const imageUrl = await this.obtenerImagen(userId, ordenData['servicioId'], ordenData['tareaId']);

      const detalle = { ...ordenData, id: ordenId, imageUrl };
      if (ordenData['estado'] === 'Pendiente') {
        this.misOrdenes.push(detalle);
      } else if (ordenData['estado'] === 'Completado') {
        this.misOrdenesCompletadas.push(detalle);
      }
    }
  }

  async obtenerImagen(usuarioId: string, servicioId: string, tareaId: string): Promise<string> {
    const imagePath = `images/${usuarioId}/${servicioId}/${tareaId}/image_0.png`;
    const imageRef = ref(this.storage, imagePath);

    try {
      return await getDownloadURL(imageRef);
    } catch (error) {
      console.warn(`Imagen no encontrada para ${imagePath}, usando imagen predeterminada.`);
      return 'assets/default-image.png'; // Ruta a una imagen predeterminada
    }
  }

  abrirModalOrden(id: string, collection: string) {
    const userId = this.userId;
    const reservaRef = doc(this.firestore, `users/${userId}/${collection}/${id}`);
    getDoc(reservaRef).then((docSnap) => {
      if (docSnap.exists()) {
        const reservaData = docSnap.data();
        this.dialog.open(ModalordenesdeservicioComponent, {
          data: {
            ...reservaData,
            id,
            origen: collection === 'reservas' ? 'ordenesDeServicio' : 'peticionesDeServicio',
          },
        });
      } else {
        console.error('Documento no encontrado en Firestore.');
      }
    }).catch((error) => {
      console.error('Error al obtener el documento:', error);
    });
  }

  marcarComoCompletado(id: string, event: Event) {
    event.stopPropagation(); // Evitar que el clic propague al contenedor
    console.log(`Marcando como completado el servicio/orden con id ${id}`);
    // Lógica para actualizar el estado en Firestore
  }

  scrollOrdersLeft(className: string) {
    const element = document.querySelector(`.${className}`);
    if (element) {
      element.scrollLeft -= 200;
    }
  }

  scrollOrdersRight(className: string) {
    const element = document.querySelector(`.${className}`);
    if (element) {
      element.scrollLeft += 200;
    }
  }

  expandSidebar() {
    this.isSidebarExpanded = true;
  }

  collapseSidebar() {
    this.isSidebarExpanded = false;
  }
}
