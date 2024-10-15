import { Component } from '@angular/core';

@Component({
  selector: 'app-perfiles-servicios',
  templateUrl: './perfiles-servicios.component.html',
  styleUrls: ['./perfiles-servicios.component.css']  // Múltiples archivos CSS ya que cargare tambien las cards
})
export class PerfilesServiciosComponent {
  isSidebarExpanded: boolean = false;

  expandSidebar() {
    this.isSidebarExpanded = true;
  }

  collapseSidebar() {
    this.isSidebarExpanded = false;
  }
}