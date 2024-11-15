import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs, doc, deleteDoc, writeBatch } from '@angular/fire/firestore';
import { TareaModalComponent } from '../tarea-modal/tarea-modal.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  deleteObject,
  listAll,
} from '@angular/fire/storage';

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
}

@Component({
  selector: 'app-tareascard',
  templateUrl: './tareascard.component.html',
  styleUrls: ['./tareascard.component.css'],
})
export class TareascardComponent implements OnInit {
  tareas: Tarea[] = [];
  descripcion: string = '';
  isSameUser: boolean = false;
  tareasRealizadas: {
    nombre: string;
    descripcion: string;
    precio: number;
    imagenes?: string[];
  }[] = [];

  constructor(private firestore: Firestore, private router: Router, public dialog: MatDialog,) {}

  async ngOnInit() {
    const usuarioMain = localStorage.getItem('usuarioMain');
    const usuarioId = localStorage.getItem('UsuarioId');

    if (!usuarioMain || !usuarioId) {
      console.error('IDs de usuario o servicio no disponibles.');
      return;
    }

    this.isSameUser = usuarioMain === usuarioId;

    try {
      const servicioCollection = collection(this.firestore, `users/${usuarioMain}/Servicios`);
      const servicioSnapshot = await getDocs(servicioCollection);

      servicioSnapshot.docs.forEach((doc) => {
        const servicioData = doc.data() as Servicio;
        if (doc.id === localStorage.getItem('UsuarioDeServicio')) {
          this.descripcion = servicioData.descripcion;
        }
      });

      const tareasCollection = collection(
        this.firestore,
        `users/${usuarioMain}/Servicios/${localStorage.getItem('UsuarioDeServicio')}/tareas`
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

  navigateToEdit(tareaId: string) {
    this.router.navigate(['/edit', tareaId]);
  }

  navigateToBooking(tareaId: string) {
    this.router.navigate(['/booking', tareaId]);
  }

  async deleteTarea(tareaId: string) {
    const usuarioMain = localStorage.getItem('usuarioMain');
    const usuarioServicio = localStorage.getItem('UsuarioDeServicio');

    if (!usuarioMain || !usuarioServicio) {
      console.error('No se pudieron obtener los datos de usuario.');
      return;
    }

    // Mostrar cuadro de diálogo con SweetAlert2
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la tarea permanentemente, incluyendo las imágenes asociadas.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-secondary',
      },
      buttonsStyling: false,
    });

    if (!result.isConfirmed) {
      console.log('Eliminación cancelada por el usuario.');
      return;
    }

    try {
      // Creamos la ruta correctamente para Firebase Storage
      const storage = getStorage();

      // Crear una referencia a la carpeta (tareaId)
      const folderRef = ref(storage, `images/${usuarioMain}/${usuarioServicio}/${tareaId}`);

      // Listar todos los archivos dentro de la carpeta (tareaId)
      const listResult = await listAll(folderRef);

      // Eliminar todos los archivos de la carpeta
      const deletePromises = listResult.items.map(itemRef => {
        return deleteObject(itemRef).then(() => {
          console.log(`Archivo eliminado: ${itemRef.fullPath}`);
        }).catch((error) => {
          console.error(`Error al eliminar el archivo: ${itemRef.fullPath}`, error);
        });
      });

      // Esperar que todos los archivos sean eliminados
      await Promise.all(deletePromises);

      // Eliminar la tarea de Firestore
      const tareaDocRef = doc(
        this.firestore,
        `users/${usuarioMain}/Servicios/${usuarioServicio}/tareas/${tareaId}`
      );
      await deleteDoc(tareaDocRef);

      // Eliminar la tarea de la lista local para actualizar la vista
      this.tareas = this.tareas.filter((t) => t.id !== tareaId);

      // Mostrar mensaje de éxito
      await Swal.fire({
        title: 'Eliminado',
        text: 'La tarea y sus imágenes han sido eliminadas con éxito.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);

      // Mostrar mensaje de error
      await Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al eliminar la tarea.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  }

  abrirModal(): void {
    const dialogRef = this.dialog.open(TareaModalComponent);
  
    dialogRef.afterClosed().subscribe(async (nuevaTarea) => {
      if (nuevaTarea) {
        // Agregar la nueva tarea a tareasRealizadas y guardarla en localStorage
        this.tareasRealizadas.push(nuevaTarea);
        localStorage.setItem(
          'tareasRealizadas',
          JSON.stringify(this.tareasRealizadas)
        );
  
        // Obtener usuarioMain y UsuarioDeServicio de localStorage
        const usuarioMain = localStorage.getItem('usuarioMain');
        const usuarioDeServicio = localStorage.getItem('UsuarioDeServicio');
  
        if (!usuarioMain || !usuarioDeServicio) {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Faltan datos de los usuarios',
            showConfirmButton: false,
            timer: 1500,
          });
          return;
        }
  
        try {
          // Crear batch usando writeBatch
          const batch = writeBatch(this.firestore); // Crear el batch correctamente
  
          // Firebase Storage
          const storage = getStorage();
  
          // Subir todas las tareas realizadas almacenadas en localStorage
          for (const tarea of this.tareasRealizadas) {
            const tareaRef = doc(collection(this.firestore, `users/${usuarioMain}/Servicios/${usuarioDeServicio}/tareas`));
            const tareaId = tareaRef.id;
  
            const tareaData: any = {
              nombre: tarea.nombre,
              descripcion: tarea.descripcion,
              precio: tarea.precio,
              imagenes: [],
            };
  
            // Subir imágenes si las tiene
            if (tarea.imagenes && tarea.imagenes.length > 0) {
              for (let i = 0; i < tarea.imagenes.length; i++) {
                const imagenBase64 = tarea.imagenes[i];
                const imagenPath = `images/${usuarioMain}/${usuarioDeServicio}/${tareaId}/image_${i}.png`;
  
                const storageRef = ref(storage, imagenPath);
                await uploadString(storageRef, imagenBase64, 'data_url');
  
                const downloadURL = await getDownloadURL(storageRef);
                tareaData.imagenes.push(downloadURL);
              }
            }
  
            // Añadir la tarea al batch para que se suba
            batch.set(tareaRef, tareaData);
          }
  
          // Ejecutar el batch para subir todas las tareas a Firestore
          await batch.commit();
  
          // Limpiar tareasRealizadas en localStorage después de subirlas
          localStorage.removeItem('tareasRealizadas');
          this.tareasRealizadas = []; // Limpiar el array en la aplicación también
  
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Tareas subidas y limpiadas correctamente',
            showConfirmButton: false,
            timer: 1500,
          });
  
          // Actualizar la lista de tareas después de la subida
          await this.ngOnInit();
        } catch (error) {
          console.error('Error al subir tareas:', error);
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Error al subir las tareas',
            text: 'Hubo un problema al subir las tareas realizadas.',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    });
  }
}
