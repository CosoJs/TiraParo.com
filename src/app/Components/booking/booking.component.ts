import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, doc, getDoc, setDoc, collection } from '@angular/fire/firestore';
import { Timestamp } from 'firebase/firestore';
import moment from 'moment';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  tareaId: string | null = null;
  tarea: any = null;
  usuarioMain: string | null = null;
  UsuarioDeServicio: string | null = null;
  usuarioId: string | null = null;
  bookingSuccess: boolean = false;

  startDate: moment.Moment = moment();
  email: string = '';
  telefono: string = '';
  description: string = '';

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private router: Router
  ) {}

  ngOnInit() {
    this.tareaId = this.route.snapshot.paramMap.get('id');
    this.usuarioMain = localStorage.getItem('usuarioMain');
    this.UsuarioDeServicio = localStorage.getItem('UsuarioDeServicio');
    this.usuarioId = localStorage.getItem('UsuarioId');

    if (!this.tareaId || !this.usuarioMain || !this.UsuarioDeServicio || !this.usuarioId) {
      console.error('ID de tarea o usuario no disponible.');
      return;
    }

    this.loadTareaDetails();
  }

  async loadTareaDetails() {
    try {
      const tareaDoc = doc(
        this.firestore,
        `users/${this.usuarioMain}/Servicios/${this.UsuarioDeServicio}/tareas/${this.tareaId}`
      );
      const tareaSnapshot = await getDoc(tareaDoc);

      if (tareaSnapshot.exists()) {
        this.tarea = tareaSnapshot.data();
      } else {
        console.error('No se encontró la tarea.');
      }
    } catch (error) {
      console.error('Error al cargar los detalles de la tarea:', error);
    }
  }

  async confirmBooking() {
    console.log("Confirming booking...");

    if (!this.tareaId || !this.usuarioMain || !this.UsuarioDeServicio || !this.usuarioId) return;

    const bookingData = {
      tareaId: this.tareaId,
      servicioId: this.UsuarioDeServicio,
      usuarioId: this.usuarioMain,
      fechaInicio: Timestamp.fromDate(this.startDate.toDate()),
      descripcion: this.description,
      email: this.email,
      telefono: this.telefono,
      estado: 'Pendiente',
      cliente: this.usuarioId,
    };

    try {
      const bookingRef1 = doc(collection(this.firestore, `users/${this.usuarioMain}/reservas`));
      await setDoc(bookingRef1, bookingData);

      const bookingRef2 = doc(collection(this.firestore, `users/${this.usuarioId}/misreservas`));
      await setDoc(bookingRef2, bookingData);

      this.bookingSuccess = true;
      setTimeout(() => this.router.navigate(['/home']), 2000);
    } catch (error) {
      console.error('Error al confirmar la reserva:', error);
    }
  }

  isSidebarExpanded: boolean = false;

  expandSidebar() {
    this.isSidebarExpanded = true;
  }

  collapseSidebar() {
    this.isSidebarExpanded = false;
  }
}
