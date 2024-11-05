import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, doc, getDoc, setDoc, collection } from '@angular/fire/firestore';
import { Timestamp } from 'firebase/firestore';
import moment from 'moment';
import Swal from 'sweetalert2';

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

  isSidebarExpanded: boolean = false;

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

  onStartDateChange(event: any) {
    this.startDate = moment(event);
    console.log("Start Date selected:", this.startDate.format('DD/MM/YY'));
  }

  onEndDateChange(event: any) {
    this.endDate = moment(event);
    console.log("End Date selected:", this.endDate.format('DD/MM/YY'));
  }

  async confirmBooking() {
    try {
      // Mostrar el spinner de carga
      Swal.fire({
        title: 'Confirmando reserva...',
        html: 'Por favor, espera mientras se confirma la reserva.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(); // Muestra el spinner
        }
      });

      console.log("Confirming booking...");
      console.log("Start date:", this.startDate.format('DD/MM/YY'));
      console.log("End date:", this.endDate.format('DD/MM/YY'));
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

      // Guardar en la primera ubicación
      const bookingRef1 = doc(collection(this.firestore, `users/${this.usuarioMain}/reservas`));
      await setDoc(bookingRef1, bookingData);

      // Guardar en la segunda ubicación
      const bookingRef2 = doc(collection(this.firestore, `users/${this.usuarioId}/misreservas`));
      await setDoc(bookingRef2, bookingData);

      this.bookingSuccess = true;

      // Ocultar el spinner y mostrar éxito
      Swal.fire('Éxito', 'Reserva confirmada con éxito.', 'success');
      setTimeout(() => this.router.navigate(['/home']), 2000);
    } catch (error) {
      console.error('Error al confirmar la reserva:', error);
      // Ocultar el spinner y mostrar error
      Swal.fire('Error', 'No se pudo confirmar la reserva.', 'error');
    }
  }

  expandSidebar() {
    this.isSidebarExpanded = true;
  }

  collapseSidebar() {
    this.isSidebarExpanded = false;
  }
}
