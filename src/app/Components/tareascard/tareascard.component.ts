import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

interface Tarea {
  id: string;
  descripcion: string;
  imagenes: string[];
  nombre: string;
  precio: number;
  currentImageIndex: number;
}

interface Servicio {
  descripcion: string;
  // Agrega aquí otras propiedades necesarias si las hay
}

@Component({
  selector: 'app-tareascard',
  templateUrl: './tareascard.component.html',
  styleUrls: ['./tareascard.component.css'],
})
export class TareascardComponent implements OnInit {
  tareas: Tarea[] = [];
  descripcion: string = ''; // Agrega una variable para almacenar la descripción

  constructor(private firestore: Firestore) {}

  async ngOnInit() {
    const usuarioMain = localStorage.getItem('usuarioMain');
    const UsuarioDeServicio = localStorage.getItem('UsuarioDeServicio');

    if (!usuarioMain || !UsuarioDeServicio) {
      console.error('IDs de usuario o servicio no disponibles.');
      return;
    }

    try {
      // Cargar la descripción del servicio
      const servicioCollection = collection(this.firestore, `users/${usuarioMain}/Servicios`);
      const servicioSnapshot = await getDocs(servicioCollection);
      
      servicioSnapshot.docs.forEach((doc) => {
        const servicioData = doc.data() as Servicio; // Accede con la interfaz definida
        if (doc.id === UsuarioDeServicio) {
          this.descripcion = servicioData.descripcion; // Obtener la descripción
        }
      });

      // Cargar las tareas
      const tareasCollection = collection(
        this.firestore,
        `users/${usuarioMain}/Servicios/${UsuarioDeServicio}/tareas`
      );
      const tareasSnapshot = await getDocs(tareasCollection);

      this.tareas = tareasSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        currentImageIndex: 0,
      })) as Tarea[];
    } catch (error) {
      console.error('Error al cargar las tareas:', error);
    }
  }

  // Métodos para cambiar la imagen
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
