import { Component } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  query,
  where,
  collectionData,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Usuario } from '../../Class/clasesSimples';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class loginComponent {
  usuario = '';
  contrasena = '';
  newUsuario = '';
  newContrasena = '';
  registerMode = false;
  credencial: any;
  UsuariosColeccion: any;

  constructor(private firestore: Firestore, private navegacion: Router) {
    this.UsuariosColeccion = collection(this.firestore, 'users');
  }

  toggleRegister() {
    this.registerMode = !this.registerMode;
  }

  login() {
    if (this.usuario.trim() === '' || this.contrasena.trim() === '') {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Ingrese usuario y contraseña válidos',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    const q = query(
      this.UsuariosColeccion,
      where('Usuario', '==', this.usuario),
      where('Contrasena', '==', this.contrasena)
    );
    collectionData(q)
      .pipe(take(1))
      .subscribe((UsuarioSnap: any) => {
        if (UsuarioSnap.length !== 0) {
          console.log('Usuario encontrado:', UsuarioSnap);
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Inicio Exitoso',
            showConfirmButton: false,
            timer: 1500,
          });
          this.credencial = UsuarioSnap[0];
          localStorage.setItem('UsuarioId', UsuarioSnap[0].UsuarioID);
          this.navegacion.navigate(['/home'], {
            state: this.credencial,
          });
        } else {
          console.log('No se encontraron usuarios con esas credenciales');
          Swal.fire({
            position: 'top-end',
            icon: 'question',
            title: 'No se ha encontrado el usuario',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
  }

  register() {
    if (this.newUsuario.trim() === '' || this.newContrasena.trim() === '') {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Ingrese un usuario o contraseña válidos',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    console.log('Registrando usuario:', this.newUsuario);
    const q = query(
      this.UsuariosColeccion,
      where('Usuario', '==', this.newUsuario)
    );
    collectionData(q)
      .pipe(take(1))
      .subscribe((UsuarioSnap: any) => {
        if (UsuarioSnap.length === 0) {
          const newUser = new Usuario();
          newUser.Usuario = this.newUsuario;
          newUser.Nombre = this.newUsuario;
          newUser.Contrasena = this.newContrasena;

          // Crear una referencia a un nuevo documento en la colección con un ID generado automáticamente
          const userDocRef = doc(this.UsuariosColeccion); 
          newUser.UsuarioID = userDocRef.id; // Asignamos el ID generado automáticamente al usuario

          // Guardar el nuevo usuario en Firestore usando setDoc
          setDoc(userDocRef, JSON.parse(JSON.stringify(newUser)))
            .then(() => {
              console.log('Usuario registrado con éxito');
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Registro exitoso',
                showConfirmButton: false,
                timer: 1500,
              });
              localStorage.setItem('UsuarioId', newUser.UsuarioID);
              this.navegacion.navigate(['/home'], {
                state: this.credencial,
              });
            })
            .catch((error) => {
              console.error('Error al registrar usuario:', error);
              Swal.fire({
                position: 'top-end',
                icon: 'warning',
                title: 'Error al registrarse',
                showConfirmButton: false,
                timer: 1500,
              });
            });
        } else {
          console.log('El nombre de usuario ya está en uso');
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: 'El nombre de usuario ya está en uso',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
  }
}
