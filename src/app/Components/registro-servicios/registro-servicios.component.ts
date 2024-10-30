import { Component } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  DocumentData,
  doc,
  setDoc,
  getDocs,
  writeBatch,
  query,
  where,
  getDoc,
} from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { TareaModalComponent } from '../tarea-modal/tarea-modal.component'; // Importa el modal

@Component({
  selector: 'app-registro-servicios',
  templateUrl: './registro-servicios.component.html',
  styleUrls: ['./registro-servicios.component.css'],
})
export class RegistroServiciosComponent {
  isSidebarExpanded: boolean = false;
  categorias: string[] = [];
  serviciosFiltrados: string[] = [];
  selectedCategoria: string = '';
  selectedServicio: string = '';
  descripcionServicio: string = '';
  aniosExperiencia: number | null = null;
  tareasRealizadas: {
    nombre: string;
    descripcion: string;
    precio: number;
    imagenes?: string[];
  }[] = [];
  horarioTrabajo: string = '';
  ubicacionServicio: string = '';
  informacionContacto: string = '';

  constructor(private firestore: Firestore, public dialog: MatDialog) {
    this.cargarCategorias();
    this.cargarTareasRealizadas();
  }

  cargarTareasRealizadas() {
    this.tareasRealizadas = JSON.parse(
      localStorage.getItem('tareasRealizadas') || '[]'
    );
  }

  expandSidebar() {
    this.isSidebarExpanded = true;
  }

  collapseSidebar() {
    this.isSidebarExpanded = false;
  }

  cargarCategorias() {
    const categoriasRef = collection(this.firestore, 'Servicios');
    collectionData(categoriasRef, { idField: 'id' }).subscribe(
      (categoriasSnap: DocumentData[]) => {
        this.categorias = categoriasSnap.map((categoria) => categoria['id']);
      }
    );
  }

  abrirModalTareas(): void {
    const dialogRef = this.dialog.open(TareaModalComponent);

    dialogRef.afterClosed().subscribe((nuevaTarea) => {
      if (nuevaTarea) {
        this.tareasRealizadas.push(nuevaTarea);
        localStorage.setItem(
          'tareasRealizadas',
          JSON.stringify(this.tareasRealizadas)
        );
      }
    });
  }

  editarTarea(tarea: any): void {
    const dialogRef = this.dialog.open(TareaModalComponent, {
      data: tarea, // Pasa la tarea al modal para edición
    });

    dialogRef.afterClosed().subscribe((tareaEditada) => {
      if (tareaEditada) {
        const index = this.tareasRealizadas.findIndex(
          (t) => t.nombre === tarea.nombre
        );
        if (index !== -1) {
          this.tareasRealizadas[index] = tareaEditada;
          localStorage.setItem(
            'tareasRealizadas',
            JSON.stringify(this.tareasRealizadas)
          );
        }
      }
    });
  }

  eliminarTarea(tarea: any, event: MouseEvent): void {
    event.stopPropagation(); // Evitar que se ejecute el evento de click del contenedor
    this.tareasRealizadas = this.tareasRealizadas.filter(
      (t) => t.nombre !== tarea.nombre
    );
    localStorage.setItem(
      'tareasRealizadas',
      JSON.stringify(this.tareasRealizadas)
    );
  }

  onCategoriaChange() {
    if (this.selectedCategoria) {
      const serviciosDocRef = doc(
        this.firestore,
        `Servicios/${this.selectedCategoria}`
      );
      getDoc(serviciosDocRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            this.serviciosFiltrados = Object.keys(data).filter(
              (key) => key !== 'Image'
            );
          } else {
            console.log('No such document!');
          }
        })
        .catch((error) => {
          console.error('Error getting document: ', error);
        });
    }
  }

  validarCampos(): string | null {
    if (!this.selectedCategoria) return 'categoría';
    if (!this.selectedServicio) return 'servicio';
    if (!this.descripcionServicio) return 'descripción';
    if (this.aniosExperiencia === null) return 'años de experiencia';
    return null;
  }

  async guardarServicio() {
    const campoInvalido = this.validarCampos();
    if (campoInvalido) {
      Swal.fire(
        'Error',
        `Por favor completa el campo: ${campoInvalido}`,
        'error'
      );
      return;
    }

    // Resto de la lógica para guardar el servicio
    try {
      const batch = writeBatch(this.firestore);
      const servicioRef = doc(collection(this.firestore, 'PerfilServicio'));

      await setDoc(servicioRef, {
        categoria: this.selectedCategoria,
        servicio: this.selectedServicio,
        descripcion: this.descripcionServicio,
        aniosExperiencia: this.aniosExperiencia,
        tareasRealizadas: this.tareasRealizadas,
        horarioTrabajo: this.horarioTrabajo,
        ubicacionServicio: this.ubicacionServicio,
        informacionContacto: this.informacionContacto,
      });

      Swal.fire('Éxito', 'Perfil de servicio creado con éxito.', 'success');
      // Reiniciar los campos después de guardar
      this.reiniciarCampos();
    } catch (error) {
      console.error('Error al guardar el servicio: ', error);
      Swal.fire('Error', 'No se pudo crear el perfil de servicio.', 'error');
    }
  }

  reiniciarCampos() {
    this.selectedCategoria = '';
    this.selectedServicio = '';
    this.descripcionServicio = '';
    this.aniosExperiencia = null;
    this.tareasRealizadas = [];
    localStorage.removeItem('tareasRealizadas');
    this.horarioTrabajo = '';
    this.ubicacionServicio = '';
    this.informacionContacto = '';
  }

  scrollLeft() {
    const container = document.querySelector('.tareas-galeria');
    if (container) {
      container.scrollBy({ left: -210, behavior: 'smooth' }); // Desplaza en el ancho de dos tarjetas
    }
  }

  scrollRight() {
    const container = document.querySelector('.tareas-galeria');
    if (container) {
      container.scrollBy({ left: 210, behavior: 'smooth' }); // Desplaza en el ancho de dos tarjetas
    }
  }
}
