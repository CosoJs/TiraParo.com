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
  misOrdenesCompletadas: any[] = [];
  misServiciosCompletados: any[] = [];
  isSidebarExpanded: boolean = false;
  userId: string = '';

  constructor(private firestore: Firestore, public dialog: MatDialog) {}

  ngOnInit() {
    this.userId = localStorage.getItem('UsuarioId') || '';
    if (this.userId) {
      this.cargarMisPeticiones(this.userId);
      this.cargarMisOrdenes(this.userId);
      this.cargarMisServiciosCompletados(this.userId);
    } else {
      console.error('UsuarioId no encontrado en localStorage.');
    }
  }

  abrirModalOrden(id: string, collection: string) {
    console.log('ID recibido:', id); 
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
            id,
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
        const reservaId = doc.id; 
        this.obtenerDetalles(reservaData, reservaId, (detalle) => {
          if (reservaData['estado'] === 'Pendiente') {
            this.misPeticiones.push(detalle);
          }
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
        const ordenId = doc.id; 
        this.obtenerDetalles(ordenData, ordenId, (detalle) => {
          if (ordenData['estado'] === 'Pendiente') {
            this.misOrdenes.push(detalle);
          } else if (ordenData['estado'] === 'Completado') {
            this.misOrdenesCompletadas.push(detalle);
          }
        });
      });
    }).catch((error) => {
      console.error('Error al cargar las órdenes:', error);
    });
  }

  cargarMisServiciosCompletados(userId: string) {
    const serviciosRef = collection(this.firestore, `users/${userId}/Servicios`);
    getDocs(serviciosRef).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const servicioData = doc.data();
        const servicioId = doc.id; 
        if (servicioData['estado'] === 'Completado') {
          const detalle = { ...servicioData, id: servicioId };
          this.misServiciosCompletados.push(detalle);
        }
      });
    }).catch((error) => {
      console.error('Error al cargar los servicios completados:', error);
    });
  }

  obtenerDetalles(data: any, id: string, callback: (detalle: any) => void) {
    callback({ ...data, id });
  }

  scrollOrdersLeft(className: string) {
    const element = document.querySelector(`.${className}`);
    if (element) {
      element.scrollLeft -= 200; // Ajusta según el desplazamiento deseado
    }
  }

  scrollOrdersRight(className: string) {
    const element = document.querySelector(`.${className}`);
    if (element) {
      element.scrollLeft += 200; // Ajusta según el desplazamiento deseado
    }
  }
}
