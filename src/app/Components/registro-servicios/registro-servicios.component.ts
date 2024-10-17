import { Component } from '@angular/core';
import { Firestore, collection, collectionData, DocumentData, doc, setDoc, getDocs, writeBatch, query, where, getDoc } from '@angular/fire/firestore';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-servicios',
  templateUrl: './registro-servicios.component.html',
  styleUrls: ['./registro-servicios.component.css']
})
export class RegistroServiciosComponent {
  isSidebarExpanded: boolean = false;

  expandSidebar() {
    this.isSidebarExpanded = true;
  }

  collapseSidebar() {
    this.isSidebarExpanded = false;
  }

  categorias: string[] = [];
  serviciosFiltrados: string[] = [];
  selectedCategoria: string = '';
  selectedServicio: string = '';
  descripcionServicio: string = '';
  nombrePerfil: string = '';
  aniosExperiencia: number | null = null;
  tareasRealizadas: string = '';
  horarioTrabajo: string = '';
  precioMin: string = '';
  precioMax: string = '';
  ubicacionServicio: string = '';
  informacionContacto: string = '';

  constructor(private firestore: Firestore) {
    this.cargarCategorias();
  }

  cargarCategorias() {
    const categoriasRef = collection(this.firestore, 'Servicios');
    collectionData(categoriasRef, { idField: 'id' }).subscribe((categoriasSnap: DocumentData[]) => {
      this.categorias = categoriasSnap.map(categoria => categoria['id']);
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
    if (!this.nombrePerfil) return 'nombre del perfil';
    if (!this.descripcionServicio) return 'descripción del servicio';
    if (this.aniosExperiencia === null) return 'años de experiencia';
    if (!this.tareasRealizadas) return 'tareas realizadas';
    if (!this.horarioTrabajo) return 'horario de trabajo';
    if (!this.precioMin || !this.precioMax) return 'rango de precios';
    if (!this.ubicacionServicio) return 'ubicación';
    return null; // Todos los campos están completos
  }

  async existePerfilConServicio(userId: string, servicio: string): Promise<boolean> {
    const serviciosCollection = collection(this.firestore, `users/${userId}/Servicios`);
    const q = query(serviciosCollection, where("servicio", "==", servicio));
    const querySnapshot = await getDocs(q);
    
    // Si hay algún documento que coincida, significa que ya existe un perfil con ese servicio
    return !querySnapshot.empty;
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

    // Verificar si ya existe un perfil con el mismo servicio para este usuario
    const perfilExistente = await this.existePerfilConServicio(userId, this.selectedServicio);
    if (perfilExistente) {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: `Ya existe un perfil con el servicio: ${this.selectedServicio}`,
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    const servicioData = {
      usuario: userId,
      categoria: this.selectedCategoria,
      servicio: this.selectedServicio,
      descripcion: this.descripcionServicio,
      nombrePerfil: this.nombrePerfil,
      aniosExperiencia: this.aniosExperiencia,
      tareasRealizadas: this.tareasRealizadas,
      horarioTrabajo: this.horarioTrabajo,
      precioMin: this.precioMin,
      precioMax: this.precioMax,
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
