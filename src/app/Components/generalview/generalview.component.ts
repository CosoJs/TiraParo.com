import { Component } from '@angular/core';

@Component({
  selector: 'app-generalview',
  templateUrl: './generalview.component.html',
  styleUrl: './generalview.component.css',
})
export class GeneralviewComponent {
  isSidebarExpanded: boolean = false;

  expandSidebar() {
    this.isSidebarExpanded = true;
  }

  collapseSidebar() {
    this.isSidebarExpanded = false;
  }
}
