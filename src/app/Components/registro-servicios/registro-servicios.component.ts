import { Component } from '@angular/core';
import { Firestore, collection, collectionData, DocumentData, doc, setDoc, getDocs, writeBatch, query, where, getDoc } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { TareaModalComponent } from '../tarea-modal/tarea-modal.component';  // Importa el modal

@Component({
  selector: 'app-registro-servicios',
  templateUrl: './registro-servicios.component.html',
  styleUrls: ['./registro-servicios.component.css']
})
export class RegistroServiciosComponent {
  isSidebarExpanded: boolean = false;
  categorias: string[] = [];
  serviciosFiltrados: string[] = [];
  selectedCategoria: string = '';
  selectedServicio: string = '';
  descripcionServicio: string = '';
  aniosExperiencia: number | null = null;
  // Define el tipo de datos que esperas para tareas
  tareasRealizadas: { nombre: string; descripcion: string; precio: number }[] = [];
  horarioTrabajo: string = '';
  ubicacionServicio: string = '';
  informacionContacto: string = '';

  constructor(private firestore: Firestore, public dialog: MatDialog) {
    this.cargarCategorias();
    this.cargarTareasRealizadas();
  }
  
  cargarTareasRealizadas() {
    this.tareasRealizadas = JSON.parse(localStorage.getItem('tareasRealizadas') || '[]');
  }  
  
  expandSidebar() {
    this.isSidebarExpanded = true;
  }

  collapseSidebar() {
    this.isSidebarExpanded = false;
  }

  cargarCategorias() {
    const categoriasRef = collection(this.firestore, 'Servicios');
    collectionData(categoriasRef, { idField: 'id' }).subscribe((categoriasSnap: DocumentData[]) => {
      this.categorias = categoriasSnap.map(categoria => categoria['id']);
    });
  }

  abrirModalTareas(): void {
    const dialogRef = this.dialog.open(TareaModalComponent);
  
    dialogRef.afterClosed().subscribe((nuevaTarea) => {
      if (nuevaTarea) {
        this.tareasRealizadas.push(nuevaTarea);
        localStorage.setItem('tareasRealizadas', JSON.stringify(this.tareasRealizadas));
      }
    });
  }  

  editarTarea(tarea: any): void {
    const dialogRef = this.dialog.open(TareaModalComponent, {
      data: tarea // Pasa la tarea al modal para edición
    });
  
    dialogRef.afterClosed().subscribe((tareaEditada) => {
      if (tareaEditada) {
        const index = this.tareasRealizadas.findIndex(t => t.nombre === tarea.nombre);
        if (index !== -1) {
          this.tareasRealizadas[index] = tareaEditada;
          localStorage.setItem('tareasRealizadas', JSON.stringify(this.tareasRealizadas));
        }
      }
    });
  }
  

  onCategoriaChange() {
    if (this.selectedCategoria) {
      const serviciosDocRef = doc(this.firestore, `Servicios/${this.selectedCategoria}`);
      getDoc(serviciosDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          this.serviciosFiltrados = Object.keys(data).filter(key => key !== 'Image');
        } else {
          console.log("No such document!");
        }
      }).catch((error) => {
        console.error("Error getting document: ", error);
      });
    }
  }

  validarCampos(): string | null {
    if (!this.selectedCategoria) return 'categoría';
    if (!this.selectedServicio) return 'servicio';
    if (!this.descripcionServicio) return 'descripción del servicio';
    if (this.aniosExperiencia === null) return 'años de experiencia';
    if (this.tareasRealizadas.length === 0) return 'tareas realizadas';
    if (!this.horarioTrabajo) return 'horario de trabajo';
    if (!this.ubicacionServicio) return 'ubicación';
    return null; // Todos los campos están completos
  }

  async guardarServicio() {
    const userId = localStorage.getItem('UsuarioId');
    const campoFaltante = this.validarCampos();

    if (campoFaltante) {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: `Por favor rellene ${campoFaltante}`,
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    if (!userId) {
      console.error("Usuario no identificado.");
      return;
    }

    const servicioData = {
      usuario: userId,
      categoria: this.selectedCategoria,
      servicio: this.selectedServicio,
      descripcion: this.descripcionServicio,
      aniosExperiencia: this.aniosExperiencia,
      tareasRealizadas: this.tareasRealizadas,
      horarioTrabajo: this.horarioTrabajo,
      ubicacion: this.ubicacionServicio,
      contacto: this.informacionContacto,
      timestamp: new Date()
    };

    const primeraUbicacionRef = doc(collection(this.firestore, `Servicios/${this.selectedCategoria}/Users`));
    const uniqueId = primeraUbicacionRef.id;
    const segundaUbicacionRef = doc(this.firestore, `users/${userId}/Servicios/${uniqueId}`);

    const batch = writeBatch(this.firestore);
    batch.set(primeraUbicacionRef, servicioData);
    batch.set(segundaUbicacionRef, servicioData);

    batch.commit().then(() => {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Registro exitoso',
        showConfirmButton: false,
        timer: 1500
      });
    }).catch((error) => {
      console.error("Error al guardar el servicio: ", error);
    });
  }
}
