import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, doc, getDoc, setDoc, collection } from '@angular/fire/firestore';
import { Timestamp } from 'firebase/firestore';

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
  bookingSuccess: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private router: Router
  ) {}

  async ngOnInit() {
    this.tareaId = this.route.snapshot.paramMap.get('id');
    this.usuarioMain = localStorage.getItem('usuarioMain');
    this.UsuarioDeServicio = localStorage.getItem('UsuarioDeServicio');

    if (!this.tareaId || !this.usuarioMain || !this.UsuarioDeServicio) {
      console.error('ID de tarea o usuario no disponible.');
      return;
    }

    await this.loadTareaDetails();
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
    if (!this.tareaId || !this.usuarioMain || !this.UsuarioDeServicio) return;
  
    try {
      // Genera una referencia con un ID automático para la nueva reserva
      const bookingRef = doc(collection(this.firestore, `users/${this.usuarioMain}/bookings`));
      
      await setDoc(bookingRef, {
        tareaId: this.tareaId,
        servicioId: this.UsuarioDeServicio,
        usuarioId: this.usuarioMain,
        fechaReserva: Timestamp.now(),
        estado: 'confirmado'
      });
  
      this.bookingSuccess = true;
      setTimeout(() => this.router.navigate(['/']), 2000);  // Redirecciona después de confirmar
    } catch (error) {
      console.error('Error al confirmar la reserva:', error);
    }
  }
  
}
