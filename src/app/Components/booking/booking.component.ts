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

  endDate: any = null; // Inicializar como null
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
    console.log("Confirmando reserva...");
    console.log("Valor de endDate antes de procesar:", this.endDate);

    // Validar datos esenciales
    if (!this.tareaId || !this.usuarioMain || !this.UsuarioDeServicio || !this.usuarioId) {
        console.error("Faltan datos obligatorios para confirmar la reserva.");
        return;
    }

    if (!this.endDate || !this.endDate.endDate) {
        console.error("La fecha de finalización no está definida o no es válida.");
        return;
    }

    let fechaFin: Date;

    // Validar y procesar el valor de endDate.endDate
    try {
        if (typeof this.endDate.endDate === 'string') {
            // Si es una cadena, convertirla a Date
            fechaFin = new Date(this.endDate.endDate);
            if (isNaN(fechaFin.getTime())) {
                throw new Error("La fecha de finalización no es válida. (Cadena no convertible)");
            }
        } else if (typeof this.endDate.endDate === 'object' && this.endDate.endDate.isValid) {
            // Si es un objeto Dayjs y es válido
            fechaFin = this.endDate.endDate.toDate();
        } else if (this.endDate.endDate instanceof Date) {
            // Si ya es un objeto Date
            fechaFin = this.endDate.endDate;
        } else {
            throw new Error("Tipo de fecha desconocido para endDate.endDate.");
        }
    } catch (error) {
        console.error("Error procesando la fecha de finalización:", error);
        return;
    }

    console.log("Fecha de finalización seleccionada:", fechaFin);

    // Construir los datos para guardar en Firestore
    const bookingData = {
        tareaId: this.tareaId,
        servicioId: this.UsuarioDeServicio,
        usuarioId: this.usuarioMain,
        fechaInicio: Timestamp.fromDate(fechaFin),
        descripcion: this.description,
        email: this.email,
        telefono: this.telefono,
        estado: "Pendiente",
        cliente: this.usuarioId,
    };

    try {
        const bookingId = doc(collection(this.firestore, `users/${this.usuarioMain}/reservas`)).id;

        const bookingRef1 = doc(this.firestore, `users/${this.usuarioMain}/reservas/${bookingId}`);
        await setDoc(bookingRef1, bookingData);

        const bookingRef2 = doc(this.firestore, `users/${this.usuarioId}/misreservas/${bookingId}`);
        await setDoc(bookingRef2, bookingData);

        this.bookingSuccess = true;
        console.log("Reserva confirmada con éxito.");
        setTimeout(() => this.router.navigate(["/home"]), 2000);
    } catch (error) {
        console.error("Error al confirmar la reserva:", error);
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
