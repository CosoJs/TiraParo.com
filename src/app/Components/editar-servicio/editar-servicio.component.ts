import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Firestore,
  doc,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from '@angular/fire/storage';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-servicio',
  templateUrl: './editar-servicio.component.html',
  styleUrls: ['./editar-servicio.component.css'],
})
export class EditarServicioComponent implements OnInit {
  tareaId: string | null = null;
  userId: string | null = null;
  perfilessevicios: string | null = null;
  nombre: string = '';
  descripcion: string = '';
  precio: number | null = null;
  imagenes: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('UsuarioId');
    this.perfilessevicios = localStorage.getItem('UsuarioDeServicio');
    this.tareaId = this.route.snapshot.paramMap.get('id');
    if (this.userId && this.perfilessevicios && this.tareaId) {
      this.cargarDatosTarea(this.tareaId);
    }
  }

  cargarDatosTarea(tareaId: string): void {
    if (this.userId && this.perfilessevicios) {
      const tareaRef = doc(this.firestore, `users/${this.userId}/Servicios/${this.perfilessevicios}/tareas/${tareaId}`);
      getDoc(tareaRef).then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          this.nombre = data['nombre'];
          this.descripcion = data['descripcion'];
          this.precio = data['precio'];
          this.imagenes = data['imagenes'] || [];
        } else {
          console.log('No se encontró la tarea con el ID proporcionado en Firestore.');
        }
      }).catch((error) => {
        console.error('Error al cargar la tarea desde Firestore:', error);
      });
    }
  }

  async onImageSelected(event: any): Promise<void> {
    const files = event.target.files;
    const storage = getStorage();
    const newImageUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = async (e: any) => {
        const imageBase64 = e.target.result;
        const imagePath = `images/${this.userId}/${this.perfilessevicios}/${this.tareaId}/image_${Date.now()}_${i}.png`;
        const storageRef = ref(storage, imagePath);

        try {
          await uploadString(storageRef, imageBase64, 'data_url');
          const downloadURL = await getDownloadURL(storageRef);
          newImageUrls.push(downloadURL);

          // Añade la URL solo después de que todas las imágenes han sido cargadas
          if (newImageUrls.length === files.length) {
            this.imagenes = [...this.imagenes, ...newImageUrls];
          }
        } catch (error) {
          console.error('Error al subir la imagen a Firebase Storage:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  async guardarCambios(): Promise<void> {
    if (this.userId && this.perfilessevicios && this.tareaId) {
      const tareaRef = doc(this.firestore, `users/${this.userId}/Servicios/${this.perfilessevicios}/tareas/${this.tareaId}`);
      try {
        await updateDoc(tareaRef, {
          nombre: this.nombre,
          descripcion: this.descripcion,
          precio: this.precio,
          imagenes: this.imagenes
        });
        Swal.fire('Éxito', 'La tarea ha sido actualizada con éxito.', 'success');
      } catch (error) {
        console.error('Error al guardar los cambios: ', error);
        Swal.fire('Error', 'No se pudo actualizar la tarea.', 'error');
      }
    }
  }

  scrollLeft() {
    const container = document.querySelector('.tareas-galeria');
    if (container) {
      container.scrollBy({ left: -210, behavior: 'smooth' });
    }
  }

  scrollRight() {
    const container = document.querySelector('.tareas-galeria');
    if (container) {
      container.scrollBy({ left: 210, behavior: 'smooth' });
    }
  }
}
