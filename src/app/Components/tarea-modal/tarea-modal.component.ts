import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-tarea-modal',
  templateUrl: './tarea-modal.component.html',
  styleUrls: ['./tarea-modal.component.css']
})
export class TareaModalComponent {
  imagePreviews: string[] = [];
  nombreTarea: string = '';
  descripcionTarea: string = '';
  precioTarea: number | null = null;

  constructor(
    private dialogRef: MatDialogRef<TareaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.nombreTarea = data.nombre || '';
      this.descripcionTarea = data.descripcion || '';
      this.precioTarea = data.precio || null;
      this.imagePreviews = data.imagenes || [];
    }
  }

  guardarTarea() {
    const nuevaTarea = {
      nombre: this.nombreTarea,
      descripcion: this.descripcionTarea,
      precio: this.precioTarea,
      imagenes: this.imagePreviews || []
    };

    this.dialogRef.close(nuevaTarea);
  }

  onImageSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      for (let file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  // Método para eliminar una imagen específica por índice
  deleteImage(index: number): void {
    this.imagePreviews.splice(index, 1);
  }

  scrollLeft() {
    const container = document.querySelector('.thumbnails');
    if (container) {
      container.scrollBy({ left: -100, behavior: 'smooth' });
    }
  }

  scrollRight() {
    const container = document.querySelector('.thumbnails');
    if (container) {
      container.scrollBy({ left: 100, behavior: 'smooth' });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
