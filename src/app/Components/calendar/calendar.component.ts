import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  daysInMonth: { day: number | null; items: { contentType: string; platform: string }[]; isToday?: boolean, isOtherMonth?: boolean }[] = [];
  selectedYear = new Date().getFullYear();
  selectedMonth = new Date().getMonth();
  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  weekdays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  reservas: any[] = [];
  ordenes: any[] = [];

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    this.loadReservas();
    this.loadOrdenes();
  }

  async loadReservas() {
    const reservasRef = collection(this.firestore, `users/${localStorage.getItem('UsuarioId')}/misreservas`);
    const querySnapshot = await getDocs(reservasRef);
    this.reservas = querySnapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        ...data,
        fechaInicio: data['fechaInicio'] ? data['fechaInicio'].toDate() : null // Convertir si existe
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
        fechaInicio: data['fechaInicio'] ? data['fechaInicio'].toDate() : null // Convertir si existe
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

    // Añadir días del mes anterior
    for (let i = startOffset; i > 0; i--) {
      this.daysInMonth.push({ day: previousMonthDays - i + 1, items: [], isOtherMonth: true });
    }

    // Añadir días del mes actual
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const isToday = this.selectedYear === today.getFullYear() &&
                      this.selectedMonth === today.getMonth() &&
                      i === today.getDate();

      const date = new Date(this.selectedYear, this.selectedMonth, i);
      const items = this.getItemsForDate(date);

      this.daysInMonth.push({ day: i, items, isToday });
    }

    // Añadir días del siguiente mes para completar la cuadrícula de 42 días (6 filas)
    const endOffset = 42 - this.daysInMonth.length;
    for (let i = 1; i <= endOffset; i++) {
      this.daysInMonth.push({ day: i, items: [], isOtherMonth: true });
    }
  }

  getDateString(day: { day: number | null }): string {
    return day.day
      ? `${this.selectedYear}-${String(this.selectedMonth + 1).padStart(2, '0')}-${String(day.day).padStart(2, '0')}`
      : '';
  }  

  getItemsForDate(date: Date) {
    const items: any[] = [];

    // Filtrar reservas y órdenes para la fecha específica
    this.reservas.forEach(reserva => {
      if (reserva.fechaInicio && reserva.fechaInicio.toDateString() === date.toDateString()) {
        items.push({ contentType: 'MIS RESERVAS', platform: 'platform-2' });
      }
    });

    this.ordenes.forEach(orden => {
      if (orden.fechaInicio && orden.fechaInicio.toDateString() === date.toDateString()) {
        items.push({ contentType: 'Ordenes', platform: 'platform-1' });
      }
    });

    return items;
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
}
