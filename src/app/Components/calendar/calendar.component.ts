import { Component } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  daysInMonth: { day: number | null; items: { contentType: string; platform: string }[]; isToday?: boolean, isOtherMonth?: boolean }[] = [];
  selectedYear = new Date().getFullYear();
  selectedMonth = new Date().getMonth();
  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  weekdays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  constructor() {
    this.generateDaysInMonth();
  }

  generateDaysInMonth() {
    this.daysInMonth = [];
    const today = new Date();
    const firstDayOfMonth = new Date(this.selectedYear, this.selectedMonth, 1).getDay();
    const daysInCurrentMonth = new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();

    // Obtener días del mes anterior
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

        const items = [];
        if (i === 2 || i === 10 || i === 17 || i === 23) {
            items.push({ contentType: 'RESERVAS', platform: 'platform-1' });
        }
        if (i === 14 || i === 25) {
            items.push({ contentType: 'MIS RESERVAS', platform: 'platform-2' });
        }

        this.daysInMonth.push({ day: i, items, isToday });
    }

    // Añadir días del siguiente mes para completar la cuadrícula de 42 días (6 filas)
    const endOffset = 42 - this.daysInMonth.length;
    for (let i = 1; i <= endOffset; i++) {
        this.daysInMonth.push({ day: i, items: [], isOtherMonth: true });
    }
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

  getDateString(day: { day: number | null }): string {
    return day.day ? `${this.selectedYear}-${String(this.selectedMonth + 1).padStart(2, '0')}-${String(day.day).padStart(2, '0')}` : '';
  }
}
