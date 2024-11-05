import { Component, OnInit } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs } from '@angular/fire/firestore';

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

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    this.userId = localStorage.getItem('UsuarioId') || '';
    if (this.userId) {
      this.cargarMisPeticiones(this.userId);
      this.cargarMisOrdenes(this.userId);
    } else {
      console.error('UsuarioId no encontrado en localStorage.');
    }
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
        this.obtenerDetalles(reservaData, reservaId, (detalle) => this.misPeticiones.push(detalle));
      });
    });
  }
  
  cargarMisOrdenes(userId: string) {
    const reservasRef = collection(this.firestore, `users/${userId}/reservas`);
    getDocs(reservasRef).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const ordenData = doc.data();
        const ordenId = doc.id; // Obtener el ID del documento principal
        this.obtenerDetalles(ordenData, ordenId, (detalle) => this.misOrdenes.push(detalle));
      });
    });
  }
  
  obtenerDetalles(data: any, documentId: string, callback: (detalle: any) => void) {
    const { usuarioId, servicioId, tareaId } = data;
    const tareaRef = doc(this.firestore, `users/${usuarioId}/Servicios/${servicioId}/tareas/${tareaId}`);
    getDoc(tareaRef).then((docSnap) => {
      const tareaData = docSnap.data();
      const detalle = {
        nombre: tareaData?.['nombre'], // Obtiene el nombre
        descripcion: tareaData?.['descripcion'], // Obtiene la descripción
        precio: tareaData?.['precio'],
        id: documentId // Usar el ID del documento principal
      };
      callback(detalle);
    });
  }
   
  scrollOrdersLeft() {
    const container = document.querySelector('.orders-thumbnails');
    if (container) {
      container.scrollBy({ left: -210, behavior: 'smooth' });
    }
  }

  scrollOrdersRight() {
    const container = document.querySelector('.orders-thumbnails');
    if (container) {
      container.scrollBy({ left: 210, behavior: 'smooth' });
    }
  }

  onCheck(item: any) {
    // Acción para el evento de check
  }
}
