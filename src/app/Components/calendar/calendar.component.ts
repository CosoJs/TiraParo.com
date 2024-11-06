import { Component } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  daysInMonth: { day: number; items: { contentType: string; platform: string }[]; isToday?: boolean }[] = [];
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
    const days = new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();

    for (let i = 1; i <= days; i++) {
      const isToday = this.selectedYear === today.getFullYear() &&
                      this.selectedMonth === today.getMonth() &&
                      i === today.getDate();

      // Añade datos de ejemplo
      const items = [];
      if (i === 2 || i === 10 || i === 17 || i === 23) {
        items.push({ contentType: 'RESERVAS', platform: 'platform-1' });
      }
      if (i === 14 || i === 25) {
        items.push({ contentType: 'MIS RESERVAS', platform: 'platform-2' });
      }

      this.daysInMonth.push({ day: i, items, isToday });
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

  getDateString(day: { day: number }): string {
    return `${this.selectedYear}-${String(this.selectedMonth + 1).padStart(2, '0')}-${String(day.day).padStart(2, '0')}`;
  }
}
