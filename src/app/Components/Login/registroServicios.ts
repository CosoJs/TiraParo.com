import { Component } from '@angular/core';
import { Servicios } from '../../Class/clasesSimples';
import { Firestore, collection, collectionData, DocumentData } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'registroServicios',
  templateUrl: './registroServicios.html',
  styleUrls: ['./registroServicios.css'],
})

export class registroServicios {
  categorias: string[] = []; // Solo almacenamos los ids como nombres de categoría
  serviciosFiltrados: string[] = []; // Solo almacenamos los ids como nombres de servicio
  selectedCategoria: string = '';
  selectedServicio: string = '';
  descripcionServicio: string = '';

  constructor(private firestore: Firestore) {
    this.cargarCategorias();
  }

  // Método para cargar los nombres de los documentos de la colección 'Categorias'
  cargarCategorias() {
    const categoriasRef = collection(this.firestore, 'Categorias');

    collectionData(categoriasRef, { idField: 'id' }).subscribe((categoriasSnap: DocumentData[]) => {
      this.categorias = categoriasSnap.map(categoria => categoria['id']); // Usamos el id de los documentos como nombre
    });
  }

  // Método que se ejecuta cuando cambia la categoría seleccionada
onCategoriaChange() {
  if (this.selectedCategoria) {
    const serviciosRef = collection(this.firestore, `Categorias/${this.selectedCategoria}/services`);

    collectionData(serviciosRef, { idField: 'id' }).subscribe((serviciosSnap: DocumentData[]) => {
      this.serviciosFiltrados = serviciosSnap.map(servicio => servicio['id']); // Usamos el id de los servicios como nombre
    });
  }
}


  // Método para guardar el servicio en Firebase (por implementar)
  guardarServicio() {
    // Implementar la lógica para guardar el servicio en Firebase
  }
}
