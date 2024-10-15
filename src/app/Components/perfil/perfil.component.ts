import { Component, OnInit } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, query, collection, where, getDocs } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  userProfileImageUrl: string = '';
  usuario: string = '';
  nombre: string = '';
  contrasena: string = '';
  biografia: string = '';
  intereses: string = '';

  constructor(
    private firestore: Firestore,
    private storage: AngularFireStorage,
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  async loadUserProfile() {
    const usuarioId = localStorage.getItem('UsuarioId');
    const userProfileDocRef = doc(this.firestore, `users/${usuarioId}`);
    try {
      const docSnapshot = await getDoc(userProfileDocRef);
      if (docSnapshot.exists()) {
        const userProfileData = docSnapshot.data();
        this.userProfileImageUrl = userProfileData['Perfil'] || '';
        this.usuario = userProfileData['Usuario'] || '';
        this.nombre = userProfileData['Nombre'] || '';
        this.contrasena = userProfileData['Contrasena'] || '';
        this.biografia = userProfileData['Biografia'] || '';
        this.intereses = userProfileData['Intereses'] || '';
      } else {
        console.warn('No profile data found for user.');
      }
    } catch (error) {
      console.error("Error al cargar el perfil del usuario:", error);
    }
  }

  // Nueva función para verificar si el usuario está disponible
  async verificarDisponibilidadUsuario(): Promise<boolean> {
    const usuariosRef = collection(this.firestore, 'users');
    const q = query(usuariosRef, where('Usuario', '==', this.usuario));

    try {
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty; // Si está vacío, significa que el usuario está disponible
    } catch (error) {
      console.error('Error al verificar disponibilidad del usuario:', error);
      return false;
    }
  }

  // Función para validar el nombre
  validarNombre(): boolean {
    const nombreRegex = /^[a-zA-Z\s]+$/; // Solo letras y espacios
    if (this.nombre.trim() === '') {
      this.mostrarError('El nombre no puede estar en blanco');
      return false;
    } else if (!nombreRegex.test(this.nombre)) {
      this.mostrarError('El nombre no puede contener números ni símbolos');
      return false;
    }
    return true;
  }

  // Función para mostrar un mensaje de éxito
  mostrarExito(mensaje: string) {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: mensaje,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  // Función para mostrar un mensaje de error
  mostrarError(mensaje: string) {
    Swal.fire({
      position: 'top-end',
      icon: 'warning',
      title: 'Error',
      text: mensaje,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  async guardarDatos() {
    // Validación antes de guardar
    if (!this.usuario || !this.contrasena) {
      this.mostrarError('Ingrese un usuario o contraseña válidos');
      return;
    }

    if (!this.validarNombre()) {
      return; // Si el nombre no es válido, detener el guardado
    }

    // Verificar disponibilidad del nombre de usuario
    const esUsuarioDisponible = await this.verificarDisponibilidadUsuario();
    if (!esUsuarioDisponible) {
      this.mostrarError('El nombre de usuario ya está en uso. Intente con otro.');
      return;
    }

    const usuarioId = localStorage.getItem('UsuarioId');
    const userProfileDocRef = doc(this.firestore, `users/${usuarioId}`);

    try {
      await setDoc(userProfileDocRef, {
        Usuario: this.usuario,
        Nombre: this.nombre,
        Contrasena: this.contrasena,
        Biografia: this.biografia,
        Intereses: this.intereses
      }, { merge: true });
      this.mostrarExito('Guardado correctamente');
    } catch (error) {
      console.error("Error al guardar los datos del usuario:", error);
      this.mostrarError('No se pudo guardar los datos. Intente nuevamente.');
    }
  }

  onProfilePicClick() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.uploadImage(file);
    }
  }

  uploadImage(file: File) {
    const usuarioId = localStorage.getItem('UsuarioId');
    const filePath = `images/${usuarioId}/${usuarioId}`; // El nombre del archivo será el UsuarioId
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.userProfileImageUrl = url;
          this.updateUserProfileImageUrl(url);
        });
      })
    ).subscribe();
  }

  async updateUserProfileImageUrl(url: string) {
    const usuarioId = localStorage.getItem('UsuarioId');
    const userProfileDocRef = doc(this.firestore, `users/${usuarioId}`);
    try {
      await setDoc(userProfileDocRef, { Perfil: url }, { merge: true });
      console.log("Profile image URL updated successfully");
      this.mostrarExito('Imagen actualizada correctamente');
    } catch (error) {
      console.error("Error al actualizar la URL de la imagen del perfil:", error);
      this.mostrarError('Error al subir la imagen');
    }
  }

  isSidebarExpanded: boolean = false;

  expandSidebar() {
    this.isSidebarExpanded = true;
  }

  collapseSidebar() {
    this.isSidebarExpanded = false;
  }
}
