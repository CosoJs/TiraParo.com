import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-tarea-modal',
  templateUrl: './tarea-modal.component.html',
  styleUrls: ['./tarea-modal.component.css'],
})
export class TareaModalComponent {
  imagePreviews: string[] = [];
  imagesToDelete: boolean[] = [];
  nombreTarea: string = '';
  descripcionTarea: string = '';
  precioTarea: number | null = null;
  isSubmitted: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<TareaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.nombreTarea = data.nombre || '';
      this.descripcionTarea = data.descripcion || '';
      this.precioTarea = data.precio || null;
      this.imagePreviews = data.imagenes || [];
      this.imagesToDelete = new Array(this.imagePreviews.length).fill(false);
    }
  }

  // Propiedad computada para el contador de imágenes
  get imageCount(): number {
    return this.imagePreviews.length;
  }

  guardarTarea() {
    this.isSubmitted = true;

    if (
      !this.nombreTarea ||
      !this.descripcionTarea ||
      this.precioTarea === null
    ) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const nuevaTarea = {
      nombre: this.nombreTarea,
      descripcion: this.descripcionTarea,
      precio: this.precioTarea,
      imagenes: this.imagePreviews.filter(
        (_, index) => !this.imagesToDelete[index]
      ),
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
          this.imagesToDelete.push(false);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  deleteImage(index: number): void {
    this.imagePreviews.splice(index, 1); // Elimina la imagen de la lista de vistas previas
    this.imagesToDelete.splice(index, 1); // Elimina el indicador de eliminación correspondiente
  }

  scrollLeft() {
    const container = document.querySelector('.thumbnails');
    if (container) {
      container.scrollBy({ left: -210, behavior: 'smooth' }); // Desplaza en el ancho de dos miniaturas
    }
  }

  scrollRight() {
    const container = document.querySelector('.thumbnails');
    if (container) {
      container.scrollBy({ left: 210, behavior: 'smooth' }); // Desplaza en el ancho de dos miniaturas
    }
  }

  close() {
    this.dialogRef.close();
  }
}
