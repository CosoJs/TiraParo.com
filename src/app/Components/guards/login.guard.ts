import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class loginguard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    if (localStorage.getItem('UsuarioId')) {
      return true;
    } else {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Necesitas iniciar sesion',
        showConfirmButton: false,
        timer: 1500,
      });
      this.router.navigate(['/']);
      return false;
    }
  }
}
