import { Component } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs } from '@angular/fire/firestore';
import { getStorage, ref, getDownloadURL } from '@angular/fire/storage';
import { MatDialog } from '@angular/material/dialog';
import { ModalordenesdeservicioComponent } from '../modalordenesdeservicio/modalordenesdeservicio.component';

@Component({
  selector: 'app-orders2',
  templateUrl: './orders2.component.html',
  styleUrls: ['./orders2.component.css'],
})
export class Orders2Component {
  misPeticiones: any[] = [];
  misServiciosCompletados: any[] = [];
  isSidebarExpanded: boolean = false;
  userId: string = '';

  private storage = getStorage(); // Inicializamos el almacenamiento

  constructor(private firestore: Firestore, public dialog: MatDialog) {}

  ngOnInit() {
    this.userId = localStorage.getItem('UsuarioId') || '';
    if (this.userId) {
      this.cargarMisPeticiones(this.userId);
      
    } else {
      console.error('UsuarioId no encontrado en localStorage.');
    }
  }

  abrirModalOrden(id: string, collection: string) {
    console.log('ID recibido:', id);
    const reservaRef = doc(this.firestore, `users/${this.userId}/${collection}/${id}`);
    getDoc(reservaRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const reservaData = docSnap.data();
          this.dialog.open(ModalordenesdeservicioComponent, {
            data: {
              ...reservaData,
              id,
              origen: collection === 'misreservas' ? 'ordenesDeServicio' : 'peticionesDeServicio',
            },
          });
        } else {
          console.error('Documento no encontrado en Firestore.');
        }
      })
      .catch((error) => {
        console.error('Error al obtener el documento:', error);
      });
  }

  expandSidebar() {
    this.isSidebarExpanded = true;
  }

  collapseSidebar() {
    this.isSidebarExpanded = false;
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

  cargarMisPeticiones(userId: string) {
    const misReservasRef = collection(this.firestore, `users/${userId}/misreservas`);
    getDocs(misReservasRef)
      .then((querySnapshot) => {
        querySnapshot.forEach(async (docSnap) => {
          const reservaData = docSnap.data();
          const reservaId = docSnap.id;
          const imageUrl = await this.obtenerImagen(reservaData['usuarioId'], reservaData['servicioId'], reservaData['tareaId']);
          const detalle = { ...reservaData, id: reservaId, imagen: imageUrl };

          if (reservaData['estado'] === 'Pendiente') {
            this.misPeticiones.push(detalle);
          }else{
            this.misServiciosCompletados.push(detalle);
          }
        });
      })
      .catch((error) => {
        console.error('Error al cargar las peticiones:', error);
      });
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
}
