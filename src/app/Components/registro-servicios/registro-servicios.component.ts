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
import { NominatimService } from '../../nominatim.service';
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from '@angular/fire/storage';

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
  ubicacionSugerencias: any[] = [];
  logoPreview: string | ArrayBuffer | null = null;

  constructor(private firestore: Firestore, public dialog: MatDialog, private nominatimService: NominatimService) {
    this.cargarCategorias();
    this.cargarTareasRealizadas();
  }

  ngOnInit() { // Método ngOnInit
    this.limpiarTareasRealizadas(); // Llama a la función para limpiar las tareas
    this.cargarTareasRealizadas(); // Puedes mantener esta llamada si quieres cargar otras tareas
  }

  buscarUbicacion() {
    // Limpia sugerencias si el campo está vacío
    if (this.ubicacionServicio.trim() === '') {
      this.ubicacionSugerencias = [];
      return;
    }

    // Si tiene al menos 3 caracteres, realiza la búsqueda
    if (this.ubicacionServicio.length > 2) {
      this.nominatimService.searchAddress(this.ubicacionServicio)
        .subscribe((data: any) => {
          this.ubicacionSugerencias = data;
        });
    }
  }

  seleccionarUbicacion(sugerencia: any) {
    this.ubicacionServicio = sugerencia.display_name;
    this.ubicacionSugerencias = []; // Limpia sugerencias tras selección
  }

  limpiarTareasRealizadas() {
    // Elimina el elemento de localStorage si existe
    localStorage.removeItem('tareasRealizadas');
    this.tareasRealizadas = []; // Limpia el arreglo en la memoria
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

  logoFile: string | null = null; // Guardar el archivo en formato base64

  onLogoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();

        // Cargar la imagen como base64
        reader.onload = (e: any) => {
            this.logoFile = e.target.result; // Guardar la imagen como base64
            this.logoPreview = e.target.result; // Establecer la vista previa
        };

        reader.readAsDataURL(file);
    }
  }


  async guardarServicio() {
    const campoInvalido = this.validarCampos();
    if (campoInvalido) {
      Swal.fire('Error', `Por favor completa el campo: ${campoInvalido}`, 'error');
      return;
    }
  
    const userId = localStorage.getItem('UsuarioId');
    if (!userId) {
      console.error('Usuario no identificado.');
      return;
    }
  
    try {
      // Verificar si ya existe un perfil para el mismo servicio
      const userServicesRef = collection(this.firestore, `users/${userId}/Servicios`);
      const queryExistingService = query(userServicesRef, where('servicio', '==', this.selectedServicio));
      const existingServiceSnapshot = await getDocs(queryExistingService);
  
      if (!existingServiceSnapshot.empty) {
        Swal.fire('Error', 'Ya tienes un perfil para este servicio.', 'error');
        return;
      }
  
      // Crear el perfil si no existe duplicado
      const batch = writeBatch(this.firestore);
      const servicioData = {
        categoria: this.selectedCategoria,
        servicio: this.selectedServicio,
        descripcion: this.descripcionServicio,
        aniosExperiencia: this.aniosExperiencia,
        horarioTrabajo: this.horarioTrabajo,
        ubicacionServicio: this.ubicacionServicio,
        informacionContacto: this.informacionContacto,
        timestamp: new Date(),
        usuario: userId,
        logo: '' // Inicializa como vacío
      };
  
      const primeraUbicacionRef = doc(collection(this.firestore, `Servicios/${this.selectedCategoria}/Users`));
      const uniqueId = primeraUbicacionRef.id;
      const segundaUbicacionRef = doc(this.firestore, `users/${userId}/Servicios/${uniqueId}`);
  
      // *** Subir el logo a Firebase Storage ***
      const storage = getStorage();
      if (this.logoFile) {
        const logoPath = `images/${userId}/${uniqueId}/logo.png`;
        const logoRef = ref(storage, logoPath);
        await uploadString(logoRef, this.logoFile, 'data_url');
  
        // Obtener la URL de descarga del logo
        const logoURL = await getDownloadURL(logoRef);
        servicioData.logo = logoURL; // Agregar la URL del logo al perfil de servicio
      }
  
      // Agregar el servicioData (con el logo actualizado) al batch
      batch.set(primeraUbicacionRef, servicioData);
      batch.set(segundaUbicacionRef, servicioData);
  
      // *** Subir las imágenes de tareas a Firebase Storage y guardar las tareas en subcolección ***
      for (const tarea of this.tareasRealizadas) {
        const tareaRef = doc(collection(this.firestore, `users/${userId}/Servicios/${uniqueId}/tareas`));
        const tareaId = tareaRef.id; // Genera el ID automáticamente
  
        // Preparar datos de la tarea
        const tareaData: any = {
          nombre: tarea.nombre,
          descripcion: tarea.descripcion,
          precio: tarea.precio,
          imagenes: []
        };
  
        if (tarea.imagenes && tarea.imagenes.length > 0) {
          for (let i = 0; i < tarea.imagenes.length; i++) {
            const imagenBase64 = tarea.imagenes[i];
            const imagenPath = `images/${userId}/${uniqueId}/${tareaId}/image_${i}.png`;
  
            const storageRef = ref(storage, imagenPath);
            await uploadString(storageRef, imagenBase64, 'data_url');
  
            // Obtener la URL de descarga y agregarla a la tarea
            const downloadURL = await getDownloadURL(storageRef);
            tareaData.imagenes.push(downloadURL); // Guardar la URL en la tarea
          }
        }
  
        // Guardar la tarea en la subcolección con la URL de las imágenes
        batch.set(tareaRef, tareaData);
      }
  
      // Una vez subidas las imágenes, ejecuta el batch para guardar el perfil y las tareas
      await batch.commit();
  
      Swal.fire('Éxito', 'Perfil de servicio creado con éxito.', 'success');
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
    this.logoFile = null; // Limpiar la variable que guarda el archivo
    this.logoPreview = null; // Limpiar la vista previa del logo
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

