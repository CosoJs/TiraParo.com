import { Component, OnInit } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ModalordenesdeservicioComponent } from '../modalordenesdeservicio/modalordenesdeservicio.component';

@Component({
  selector: 'app-ordenes',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdenesComponent implements OnInit {
  misPeticiones: any[] = [];
  misOrdenes: any[] = [];
  isSidebarExpanded: boolean = false;
  userId: string = '';

  constructor(private firestore: Firestore, public dialog: MatDialog) {}

  ngOnInit() {
    this.userId = localStorage.getItem('UsuarioId') || '';
    if (this.userId) {
      this.cargarMisPeticiones(this.userId);
      this.cargarMisOrdenes(this.userId);
    } else {
      console.error('UsuarioId no encontrado en localStorage.');
    }
  }

  abrirModalOrden(id: string, collection: string) {
    console.log('ID recibido:', id); // Verificar si el ID es correcto
    const userId = localStorage.getItem('UsuarioId');
    if (!userId) {
      console.error('UsuarioId no encontrado en localStorage.');
      return;
    }
  
    const reservaRef = doc(this.firestore, `users/${userId}/${collection}/${id}`);
    getDoc(reservaRef).then((docSnap) => {
      if (docSnap.exists()) {
        const reservaData = docSnap.data();
        const dialogRef = this.dialog.open(ModalordenesdeservicioComponent, {
          data: {
            id,  // Aquí pasamos el ID que recibes como argumento a la función
            cliente: reservaData?.['cliente'],
            descripcion: reservaData?.['descripcion'],
            email: reservaData?.['email'],
            estado: reservaData?.['estado'],
            fechaInicio: reservaData?.['fechaInicio'],
            servicioId: reservaData?.['servicioId'],
            tareaId: reservaData?.['tareaId'],
            telefono: reservaData?.['telefono'],
            usuarioId: reservaData?.['usuarioId'],
            origen: collection === 'reservas' ? 'ordenesDeServicio' : 'peticionesDeServicio'
          },
        });        
      } else {
        console.error('Documento no encontrado en Firestore.');
      }
    }).catch((error) => {
      console.error('Error al obtener el documento:', error);
    });
  }
  

  expandSidebar() {
    this.isSidebarExpanded = true;
  }

  collapseSidebar() {
    this.isSidebarExpanded = false;
  }

  cargarMisPeticiones(userId: string) {
    const misReservasRef = collection(this.firestore, `users/${userId}/misreservas`);
    getDocs(misReservasRef).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const reservaData = doc.data();
        const reservaId = doc.id; // Obtener el ID del documento principal
        console.log('Reserva ID:', reservaId); // Verificar ID
        this.obtenerDetalles(reservaData, reservaId, (detalle) => {
          console.log('Detalle:', detalle); // Verificar datos
          this.misPeticiones.push(detalle);
        });
      });
    }).catch((error) => {
      console.error('Error al cargar las peticiones:', error);
    });
  }

  cargarMisOrdenes(userId: string) {
    const reservasRef = collection(this.firestore, `users/${userId}/reservas`);
    getDocs(reservasRef).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const ordenData = doc.data();
        const ordenId = doc.id; // Obtener el ID del documento principal
        console.log('Orden ID:', ordenId); // Verificar ID
        this.obtenerDetalles(ordenData, ordenId, (detalle) => {
          console.log('Detalle de orden:', detalle); // Verificar datos
          this.misOrdenes.push(detalle);
        });
      });
    }).catch((error) => {
      console.error('Error al cargar las órdenes:', error);
    });
  }

  obtenerDetalles(data: any, documentId: string, callback: (detalle: any) => void) {
    const { usuarioId, servicioId, tareaId } = data;
    if (!usuarioId || !servicioId || !tareaId) {
      console.error('Datos faltantes:', { usuarioId, servicioId, tareaId });
      return;
    }
    
    const tareaRef = doc(this.firestore, `users/${usuarioId}/Servicios/${servicioId}/tareas/${tareaId}`);
    getDoc(tareaRef).then((docSnap) => {
      const tareaData = docSnap.data();
      const detalle = {
        nombre: tareaData?.['nombre'],
        descripcion: tareaData?.['descripcion'],
        precio: tareaData?.['precio'],
        id: documentId // Usar el ID del documento principal
      };
      callback(detalle);
    }).catch((error) => {
      console.error('Error al obtener los detalles de la tarea:', error);
    });
  }

  scrollOrdersLeft(containerClass: string) {
    const container = document.querySelector(`.${containerClass}`);
    if (container) {
      container.scrollBy({ left: -210, behavior: 'smooth' });
    }
  }

  scrollOrdersRight(containerClass: string) {
    const container = document.querySelector(`.${containerClass}`);
    if (container) {
      container.scrollBy({ left: 210, behavior: 'smooth' });
    }
  }
}
