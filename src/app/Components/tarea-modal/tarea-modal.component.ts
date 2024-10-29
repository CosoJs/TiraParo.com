import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-tarea-modal',
  templateUrl: './tarea-modal.component.html',
  styleUrls: ['./tarea-modal.component.css']
})
export class TareaModalComponent {
  imagePreviews: string[] = [];
  constructor(private dialogRef: MatDialogRef<TareaModalComponent>) {}
  nombreTarea: string = '';
  descripcionTarea: string = '';
  precioTarea: number | null = null;

  // Método para guardar la tarea en localStorage
  guardarTarea() {
    const nuevaTarea = {
      nombre: this.nombreTarea,
      descripcion: this.descripcionTarea,
      precio: this.precioTarea,
      imagenes: this.imagePreviews || []
    };
  
    let tareas = JSON.parse(localStorage.getItem('tareasRealizadas') || '[]');
    tareas.push(nuevaTarea);
    localStorage.setItem('tareasRealizadas', JSON.stringify(tareas));
  
    this.dialogRef.close(nuevaTarea); // Cierra el modal y pasa la tarea
  }  


  // Método que se ejecuta cuando se seleccionan imágenes
  onImageSelected(event: any): void {
    const files = event.target.files;
    this.imagePreviews = [];

    if (files && files.length > 0) {
      for (let file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result); // Almacena la URL de la imagen
        };
        reader.readAsDataURL(file); // Leer el archivo como URL
      }
    }
  }

  // Método para desplazarse a la izquierda
  scrollLeft() {
    const container = document.querySelector('.thumbnails');
    if (container) {
      container.scrollBy({
        left: -100, // Ajusta este valor según la cantidad de desplazamiento que desees
        behavior: 'smooth'
      });
    }
  }

  // Método para desplazarse a la derecha
  scrollRight() {
    const container = document.querySelector('.thumbnails');
    if (container) {
      container.scrollBy({
        left: 100, // Ajusta este valor según la cantidad de desplazamiento que desees
        behavior: 'smooth'
      });
    }
  }

  // Método para ver una imagen en tamaño completo (opcional)
  viewImage(imgSrc: string) {
    // Aquí puedes implementar una funcionalidad para ver la imagen en tamaño completo si lo deseas
    console.log("Imagen seleccionada:", imgSrc);
  }

  close() {
    this.dialogRef.close(); // Cierra el modal
  }
}
