import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

interface Tarea {
  id: string;
  descripcion: string;
  imagenes: string[];
  nombre: string;
  precio: number;
  currentImageIndex: number; // Add currentImageIndex here
}

@Component({
  selector: 'app-tareascard',
  templateUrl: './tareascard.component.html',
  styleUrls: ['./tareascard.component.css'],
})
export class TareascardComponent implements OnInit {
  tareas: Tarea[] = [];

  constructor(private firestore: Firestore) {}

  async ngOnInit() {
    const usuarioMain = localStorage.getItem('usuarioMain');
    const UsuarioDeServicio = localStorage.getItem('UsuarioDeServicio');

    if (!usuarioMain || !UsuarioDeServicio) {
      console.error('IDs de usuario o servicio no disponibles.');
      return;
    }

    try {
      const tareasCollection = collection(
        this.firestore,
        `users/${usuarioMain}/Servicios/${UsuarioDeServicio}/tareas`
      );
      const tareasSnapshot = await getDocs(tareasCollection);

      this.tareas = tareasSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        currentImageIndex: 0, // Initialize each task with a currentImageIndex property
      })) as Tarea[];
    } catch (error) {
      console.error('Error al cargar las tareas:', error);
    }
  }

  // Methods to change the image
  prevImage(tarea: Tarea) {
    tarea.currentImageIndex =
      tarea.currentImageIndex > 0
        ? tarea.currentImageIndex - 1
        : tarea.imagenes.length - 1;
  }

  nextImage(tarea: Tarea) {
    tarea.currentImageIndex =
      tarea.currentImageIndex < tarea.imagenes.length - 1
        ? tarea.currentImageIndex + 1
        : 0;
  }
}
