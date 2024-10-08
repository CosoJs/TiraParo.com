import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'], // Corrected plural spelling
})
export class SidebarComponent {
  isHovered: boolean = false; // Variable to track hover state
  activeItem: string | null = null; // Tracks the currently highlighted item

  // Called when mouse enters the sidebar
  onMouseEnter() {
    this.isHovered = true;
  }

  // Called when mouse leaves the sidebar
  onMouseLeave() {
    this.isHovered = false;
  }

  // Called when hovering over an item to highlight it
  highlightItem(title: string) {
    this.activeItem = title;
  }

  // Called when mouse leaves an item to remove the highlight
  removeHighlight() {
    this.activeItem = null;
  }

  // Called when a navigation item is clicked
  onNavItemClicked(item: string) {
    console.log(`${item} clicked!`); // Corrected string interpolation
  }
}
