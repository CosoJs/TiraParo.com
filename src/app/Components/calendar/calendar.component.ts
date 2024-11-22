import { Component, OnInit } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ModalordenesdeservicioComponent } from '../modalordenesdeservicio/modalordenesdeservicio.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  daysInMonth: {
    day: number | null;
    items: { contentType: string; platform: string; id: string; collection: string }[];
    isToday?: boolean;
    isOtherMonth?: boolean;
  }[] = [];
  selectedYear = new Date().getFullYear();
  selectedMonth = new Date().getMonth();
  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  weekdays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  reservas: any[] = [];
  ordenes: any[] = [];
  modalItems: any[] = [];
  modalOpen = false;

  constructor(private firestore: Firestore, public dialog: MatDialog) {}

  ngOnInit() {
    this.loadReservas();
    this.loadOrdenes();
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

  async loadReservas() {
    const reservasRef = collection(this.firestore, `users/${localStorage.getItem('UsuarioId')}/misreservas`);
    const querySnapshot = await getDocs(reservasRef);
    this.reservas = querySnapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        ...data,
        fechaInicio: data['fechaInicio'] ? data['fechaInicio'].toDate() : null,
        id: doc.id,
        collection: 'misreservas'
      };
    });
    this.generateDaysInMonth();
  }

  async loadOrdenes() {
    const ordenesRef = collection(this.firestore, `users/${localStorage.getItem('UsuarioId')}/reservas`);
    const querySnapshot = await getDocs(ordenesRef);
    this.ordenes = querySnapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        ...data,
        fechaInicio: data['fechaInicio'] ? data['fechaInicio'].toDate() : null,
        id: doc.id,
        collection: 'reservas'
      };
    });
    this.generateDaysInMonth();
  }

  generateDaysInMonth() {
    this.daysInMonth = [];
    const today = new Date();
    const firstDayOfMonth = new Date(this.selectedYear, this.selectedMonth, 1).getDay();
    const daysInCurrentMonth = new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();

    const previousMonthDays = new Date(this.selectedYear, this.selectedMonth, 0).getDate();
    const startOffset = (firstDayOfMonth + 6) % 7;

    for (let i = startOffset; i > 0; i--) {
      this.daysInMonth.push({ day: previousMonthDays - i + 1, items: [], isOtherMonth: true });
    }

    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const isToday = this.selectedYear === today.getFullYear() &&
                      this.selectedMonth === today.getMonth() &&
                      i === today.getDate();

      const date = new Date(this.selectedYear, this.selectedMonth, i);
      const items = this.getItemsForDate(date);

      this.daysInMonth.push({ day: i, items, isToday });
    }

    const endOffset = 42 - this.daysInMonth.length;
    for (let i = 1; i <= endOffset; i++) {
      this.daysInMonth.push({ day: i, items: [], isOtherMonth: true });
    }
  }

  getItemsForDate(date: Date) {
    const items: any[] = [];
  
    this.reservas.forEach(reserva => {
      if (reserva.fechaInicio && reserva.fechaInicio.toDateString() === date.toDateString()) {
        items.push({ 
          contentType: 'MIS RESERVAS', 
          platform: 'platform-2', 
          id: reserva.id, 
          collection: reserva.collection,
          clickEvent: `abrirModalOrden(${reserva.id}, 'misreservas')` // Añadido el evento
        });
      }
    });
  
    this.ordenes.forEach(orden => {
      if (orden.fechaInicio && orden.fechaInicio.toDateString() === date.toDateString()) {
        items.push({ 
          contentType: 'Ordenes', 
          platform: 'platform-1', 
          id: orden.id, 
          collection: orden.collection,
          clickEvent: `abrirModalOrden(${orden.id}, 'reservas')` // Añadido el evento
        });
      }
    });
  
    return items;
  }  

  abrirModalDetalles(day: any) {
    this.modalItems = [];
    const userId = localStorage.getItem('UsuarioId');
    if (!userId) {
      console.error('UsuarioId no encontrado en localStorage.');
      return;
    }

    day.items.forEach((item: any) => {
      const reservaRef = doc(this.firestore, `users/${userId}/${item.collection}/${item.id}`);
      getDoc(reservaRef).then((docSnap) => {
        if (docSnap.exists()) {
          const reservaData = docSnap.data();
          this.modalItems.push({
            contentType: item.contentType,
            platform: item.platform,
            details: reservaData['descripcion'] || 'Sin descripción'  // Usa ['descripcion'] en lugar de reservaData.descripcion
          });          
          this.modalOpen = true;
        } else {
          console.error('Documento no encontrado.');
        }
      }).catch(error => console.error('Error al cargar los detalles:', error));
    });
  }

  cerrarModal() {
    this.modalOpen = false;
    this.modalItems = [];
  }

  prevMonth() {
    if (this.selectedMonth === 0) {
      this.selectedMonth = 11;
      this.selectedYear--;
    } else {
      this.selectedMonth--;
    }
    this.generateDaysInMonth();
  }

  nextMonth() {
    if (this.selectedMonth === 11) {
      this.selectedMonth = 0;
      this.selectedYear++;
    } else {
      this.selectedMonth++;
    }
    this.generateDaysInMonth();
  }

  getDateString(day: any): string {
    const date = new Date(this.selectedYear, this.selectedMonth, day.day);
    return date.toISOString().split('T')[0];  // Devuelve la fecha en formato 'YYYY-MM-DD'
  }
  
}
