import { Component } from '@angular/core';

@Component({
  selector: 'app-servicio-de-usuarios',
  templateUrl: './servicio-de-usuarios.component.html',
  styleUrl: './servicio-de-usuarios.component.css'
})
export class ServicioDeUsuariosComponent {
  isSidebarExpanded: boolean = false;

  expandSidebar() {
    this.isSidebarExpanded = true;
  }

  collapseSidebar() {
    this.isSidebarExpanded = false;
  }
}
