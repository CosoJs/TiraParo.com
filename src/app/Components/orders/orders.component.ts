import { Component } from '@angular/core';

@Component({
  selector: 'app-ordenes',
  templateUrl: './orders.component.html', 
  styleUrls: ['./orders.component.css']
})
export class OrdenesComponent {
  cards = [
    { title: 'Card 1', description: 'This is the first card.' },
    { title: 'Card 2', description: 'This is the second card.' },
    { title: 'Card 3', description: 'This is the third card.' },
    { title: 'Card 4', description: 'This is the fourth card.' },
    { title: 'Card 5', description: 'This is the fifth card.' },
    { title: 'Card 6', description: 'This is the sixth card.' }
  ];

  isSidebarExpanded: boolean = false;

  expandSidebar() {
    this.isSidebarExpanded = true;
  }

  collapseSidebar() {
    this.isSidebarExpanded = false;
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
}
