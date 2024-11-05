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
  endDate: moment.Moment = moment();
  startTime: string = '';
  duration: number = 1;

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private router: Router
  ) {}

  ngOnInit() {
    console.log("Component initialized");
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

  onStartDateChange(event: any) {
    this.startDate = moment(event.startDate || event); // Asegura que es un objeto moment
    console.log("Start Date selected:", this.startDate.format('YYYY-MM-DD'));
  }

  onEndDateChange(event: any) {
    this.endDate = moment(event.startDate || event); // Asegura que es un objeto moment
    console.log("End Date selected:", this.endDate.format('YYYY-MM-DD'));
  }

  async confirmBooking() {
    console.log("Confirming booking...");

    // Asegurarse de que startDate y endDate sean instancias de moment
    if (!moment.isMoment(this.startDate)) {
      this.startDate = moment(this.startDate);
    }
    if (!moment.isMoment(this.endDate)) {
      this.endDate = moment(this.endDate);
    }

    console.log("Start date:", this.startDate.format('YYYY-MM-DD'));
    console.log("End date:", this.endDate.format('YYYY-MM-DD'));
    console.log("Start time:", this.startTime);
    console.log("Duration:", this.duration);

    if (!this.tareaId || !this.usuarioMain || !this.UsuarioDeServicio || !this.usuarioId) return;

    const bookingData = {
      tareaId: this.tareaId,
      servicioId: this.UsuarioDeServicio,
      usuarioId: this.usuarioMain,
      fechaInicio: Timestamp.fromDate(this.startDate.toDate()),
      fechaFin: Timestamp.fromDate(this.endDate.toDate()),
      horaInicio: this.startTime,
      duracionHoras: this.duration,
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
