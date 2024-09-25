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
  credencial: any; // Asegúrate de definir el tipo adecuado si es posible
  UsuariosColeccion: any; // Define el tipo adecuado

  constructor(private firestore: Firestore, private navegacion: Router) {
    this.UsuariosColeccion = collection(this.firestore, 'users'); // Inicialización correcta
  }

  toggleRegister() {
    this.registerMode = !this.registerMode;
  }

  login() {
    if (this.usuario.trim() === '' || this.contrasena.trim() === '') {
      alert('Por favor, ingrese usuario y contraseña válidos.');
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
          alert('Acceso Exitoso');

          // Asigna UsuarioSnap a credencial
          this.credencial = UsuarioSnap[0];

          // Guardar UsuarioId en localStorage
          localStorage.setItem('UsuarioId', UsuarioSnap[0].UsuarioID);

          this.navegacion.navigate(['/main'], { state: this.credencial });
        } else {
          console.log('No se encontraron usuarios con esas credenciales');
          alert('No se encontraron usuarios con esas credenciales');
        }
      });
  }

  register() {
    if (this.newUsuario.trim() === '' || this.newContrasena.trim() === '') {
      alert('Por favor, ingrese un nombre de usuario y contraseña válidos.');
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
          const newUserId = this.generateRandomString(20);
          const newUser = new Usuario();
          newUser.UsuarioID = newUserId;
          newUser.Usuario = this.newUsuario;
          newUser.Nombre = this.newUsuario;
          newUser.Contrasena = this.newContrasena;

          // Crear una referencia al documento del usuario con el ID generado
          const userDocRef = doc(this.firestore, `users/${newUserId}`);

          // Guardar el nuevo usuario en Firestore usando setDoc
          setDoc(userDocRef, JSON.parse(JSON.stringify(newUser)))
            .then(() => {
              console.log('Usuario registrado con éxito');
              alert('Registro exitoso');
              this.toggleRegister(); // No necesitas pasarle un evento aquí
            })
            .catch((error) => {
              console.error('Error al registrar usuario:', error);
              alert('Error al registrar usuario');
            });
        } else {
          console.log('El nombre de usuario ya está en uso');
          alert('El nombre de usuario ya está en uso');
        }
      });
  }

  generateRandomString(num: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
