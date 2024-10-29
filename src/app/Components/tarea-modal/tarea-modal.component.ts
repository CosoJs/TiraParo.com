import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-tarea-modal',
  templateUrl: './tarea-modal.component.html',
  styleUrls: ['./tarea-modal.component.css']
})
export class TareaModalComponent {
  imagePreviews: string[] = [];
  imagesToDelete: boolean[] = [];
  nombreTarea: string = '';
  descripcionTarea: string = '';
  precioTarea: number | null = null;
  isSubmitted: boolean = false; // Variable para rastrear si se ha enviado el formulario

  constructor(
      private dialogRef: MatDialogRef<TareaModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
  ) {
      if (data) {
          this.nombreTarea = data.nombre || '';
          this.descripcionTarea = data.descripcion || '';
          this.precioTarea = data.precio || null;
          this.imagePreviews = data.imagenes || [];
          this.imagesToDelete = new Array(this.imagePreviews.length).fill(false); // Inicializa el arreglo
      }
  }

  // Método para marcar una imagen para eliminar
  markForDeletion(index: number): void {
      this.imagesToDelete[index] = !this.imagesToDelete[index]; // Alternar estado
  }

  guardarTarea() {
    this.isSubmitted = true; // Marcar que se intentó enviar el formulario

    // Validar campos obligatorios
    if (!this.nombreTarea || !this.descripcionTarea || this.precioTarea === null) {
        alert('Por favor, completa todos los campos obligatorios.'); // Mensaje de error
        return; // No cerrar el modal si hay errores
    }

    const nuevaTarea = {
        nombre: this.nombreTarea,
        descripcion: this.descripcionTarea,
        precio: this.precioTarea,
        imagenes: this.imagePreviews.filter((_, index) => !this.imagesToDelete[index]) // Filtrar las imágenes marcadas para eliminar
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
                  this.imagesToDelete.push(false); // Agregar estado para la nueva imagen
              };
              reader.readAsDataURL(file);
          }
      }
  }

  // Método para eliminar una imagen específica de la vista
  deleteImage(index: number): void {
      this.markForDeletion(index); // Solo marcar para eliminar en la vista
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

