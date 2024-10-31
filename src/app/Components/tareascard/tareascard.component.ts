import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

interface Tarea {
  id: string;
  descripcion: string;
  imagenes: string[];
  nombre: string;
  precio: number;
}

@Component({
  selector: 'app-tareascard',
  templateUrl: './tareascard.component.html',
  styleUrls: ['./tareascard.component.css']
})
export class TareascardComponent implements OnInit {
  tareas: Tarea[] = [];
  currentImageIndex: number = 0; // Para manejar la imagen actual

  constructor(private firestore: Firestore) {}

  async ngOnInit() {
    const usuarioMain = localStorage.getItem('usuarioMain');
    const UsuarioDeServicio = localStorage.getItem('UsuarioDeServicio');

    if (!usuarioMain || !UsuarioDeServicio) {
      console.error("IDs de usuario o servicio no disponibles.");
      return;
    }

    try {
      const tareasCollection = collection(this.firestore, `users/${usuarioMain}/Servicios/${UsuarioDeServicio}/tareas`);
      const tareasSnapshot = await getDocs(tareasCollection);

      this.tareas = tareasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Tarea[];
    } catch (error) {
      console.error('Error al cargar las tareas:', error);
    }
  }

  // Métodos para cambiar de imagen
  prevImage() {
    this.currentImageIndex = (this.currentImageIndex > 0) ? this.currentImageIndex - 1 : this.currentImageIndex;
  }

  nextImage() {
    this.currentImageIndex = (this.currentImageIndex < this.tareas[0].imagenes.length - 1) ? this.currentImageIndex + 1 : this.currentImageIndex;
  }
}
