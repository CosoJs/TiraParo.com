import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { ActivatedRoute , Router } from '@angular/router';
import Swal from 'sweetalert2';
import { doc, deleteDoc } from '@angular/fire/firestore';

interface User {
  id: string;
  categoria: string;
  servicio: string;
  descripcion: string;
  nombreperfil: string;
  logo: string;
  usuario?: string;
}

@Component({
  selector: 'app-perfilcards',
  templateUrl: './perfilcards.component.html',
  styleUrls: ['./perfilcards.component.css'],
})
export class PerfilcardsComponent implements OnInit {
  users: User[] = [];
  showDeleteButton = false;

  constructor(private firestore: Firestore, private router: Router) {}

  async ngOnInit() {

    // Verifica si estamos en la ruta '/mis-perfiles-servicio'
    if (this.router.url === '/mis-perfiles-servicio') {
      this.showDeleteButton = true;
    } else {
      this.showDeleteButton = false;
    }
    
    const userId = localStorage.getItem('UsuarioId');
    if (!userId) {
      console.error('Usuario no identificado.');
      return;
    }

    try {
      const isMisPerfilesServicio = this.isInMisPerfilesServicio();
      const filtro = localStorage.getItem('filtro'); // Lee el filtro desde el localStorage

      if (isMisPerfilesServicio) {
        // Carga los perfiles de "Mis Perfiles Servicio"
        await this.loadUserServices(userId);
      } else if (filtro) {
        // Carga perfiles según el filtro seleccionado
        await this.loadFilteredServices(filtro);
      } else {
        // Carga todos los perfiles globales
        await this.loadAllServices();
      }
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
    }
  }

  private isInMisPerfilesServicio(): boolean {
    return window.location.pathname.includes('/mis-perfiles-servicio');
  }

  private async loadUserServices(userId: string) {
    const userServicesCollection = collection(
      this.firestore,
      `users/${userId}/Servicios`
    );
    const userServicesSnapshot = await getDocs(userServicesCollection);
    userServicesSnapshot.forEach((serviceDoc) => {
      const data = serviceDoc.data();
      this.users.push({
        id: serviceDoc.id,
        usuario: data['usuario'],
        logo: data['logo'],
        ...data,
      } as User);
    });
  }

  private async loadFilteredServices(filtro: string) {
    const usersCollection = collection(this.firestore, `Servicios/${filtro}/Users`);
    const usersSnapshot = await getDocs(usersCollection);
    usersSnapshot.forEach((userDoc) => {
      const data = userDoc.data();
      this.users.push({
        id: userDoc.id,
        usuario: data['usuario'],
        logo: data['logo'],
        ...data,
      } as User);
    });
  }

  private async loadAllServices() {
    const serviciosCollection = collection(this.firestore, 'Servicios');
    const serviciosSnapshot = await getDocs(serviciosCollection);

    for (const servicioDoc of serviciosSnapshot.docs) {
      const usersCollection = collection(
        this.firestore,
        `Servicios/${servicioDoc.id}/Users`
      );
      const usersSnapshot = await getDocs(usersCollection);
      usersSnapshot.forEach((userDoc) => {
        const data = userDoc.data();
        this.users.push({
          id: userDoc.id,
          usuario: data['usuario'],
          logo: data['logo'],
          ...data,
        } as User);
      });
    }
  }

  onCardClick(user: User) {
    const usuarioId = user.usuario;
    if (usuarioId) {
      localStorage.setItem('UsuarioDeServicio', user.id);
      localStorage.setItem('usuarioMain', usuarioId);
      this.router.navigate(['/Servicio-De-Usuarios']);
    } else {
      console.error('ID de usuario no disponible.', user);
    }
  }

  async onDelete(user: User, event: Event) {
    event.stopPropagation(); // Evitar que el evento se propague al contenedor de la tarjeta
    const usuarioId = localStorage.getItem('UsuarioId');
    if (!usuarioId) {
      console.error('Usuario no identificado.');
      return;
    }
  
    const servicioPath = `users/${usuarioId}/Servicios/${user.id}`;
    const categoriaPath = `Servicios/${user.categoria}/Users/${user.id}`;
  
    // Mostrar cuadro de confirmación
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el servicio permanentemente.',
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
      // Eliminar de la primera ubicación
      const servicioDoc = doc(this.firestore, servicioPath);
      await deleteDoc(servicioDoc);
  
      // Eliminar de la segunda ubicación
      const categoriaDoc = doc(this.firestore, categoriaPath);
      await deleteDoc(categoriaDoc);
  
      // Eliminar del arreglo local para actualizar la vista
      this.users = this.users.filter((u) => u.id !== user.id);
  
      // Mostrar mensaje de éxito
      await Swal.fire({
        title: 'Eliminado',
        text: 'El servicio ha sido eliminado con éxito.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
    } catch (error) {
      console.error('Error al eliminar el servicio:', error);
  
      // Mostrar mensaje de error
      await Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al eliminar el servicio.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  }
  
}
