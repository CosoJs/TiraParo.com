import { Component } from '@angular/core';
import { Servicios } from '../../Class/clasesSimples';
import { Firestore, collection, collectionData, DocumentData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { getDoc, doc } from "firebase/firestore";

@Component({
  selector: 'app-registro-servicios',
  templateUrl: './registro-servicios.component.html',
  styleUrl: './registro-servicios.component.css'
})
export class RegistroServiciosComponent {
  isSidebarExpanded: boolean = false;

  expandSidebar() {
    this.isSidebarExpanded = true;
  }

  collapseSidebar() {
    this.isSidebarExpanded = false;
  }

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
    const categoriasRef = collection(this.firestore, 'Servicios');

    collectionData(categoriasRef, { idField: 'id' }).subscribe((categoriasSnap: DocumentData[]) => {
      this.categorias = categoriasSnap.map(categoria => categoria['id']); // Usamos el id de los documentos como nombre
    });
  }

  // Método que se ejecuta cuando cambia la categoría seleccionada
  onCategoriaChange() {
    if (this.selectedCategoria) {
      const serviciosDocRef = doc(this.firestore, `Servicios/${this.selectedCategoria}`);

      getDoc(serviciosDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();

          // Filtramos los campos para obtener solo los nombres de los campos excepto 'Image'
          this.serviciosFiltrados = Object.keys(data).filter(key => key !== 'Image'); // Obtenemos solo los nombres de los campos
        } else {
          console.log("No such document!");
        }
      }).catch((error) => {
        console.error("Error getting document: ", error);
      });
    }
  }

  


  // Método para guardar el servicio en Firebase (por implementar)
  guardarServicio() {
    // Implementar la lógica para guardar el servicio en Firebase
  }
}
