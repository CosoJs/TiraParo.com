import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Router } from '@angular/router';

interface User {
  id: string;
  categoria: string;
  servicio: string;
  descripcion: string;
  nombreperfil: string;
  Image: string;
}

@Component({
  selector: 'app-perfilcards',
  templateUrl: './perfilcards.component.html',
  styleUrls: ['./perfilcards.component.css']
})
export class PerfilcardsComponent implements OnInit {
  users: User[] = [];

  constructor(private firestore: Firestore, private router: Router) {}

  async ngOnInit() {
    const userId = localStorage.getItem('UsuarioId');
    if (!userId) {
      console.error("Usuario no identificado.");
      return;
    }

    try {
      const isMisPerfilesServicio = this.isInMisPerfilesServicio();
      if (isMisPerfilesServicio) {
        const userServicesCollection = collection(this.firestore, `users/${userId}/Servicios`);
        const userServicesSnapshot = await getDocs(userServicesCollection);
        userServicesSnapshot.forEach(serviceDoc => {
          this.users.push({ id: serviceDoc.id, ...serviceDoc.data() } as User);
        });
      } else {
        const serviciosCollection = collection(this.firestore, 'Servicios');
        const serviciosSnapshot = await getDocs(serviciosCollection);
      
        for (const servicioDoc of serviciosSnapshot.docs) {
          const usersCollection = collection(this.firestore, `Servicios/${servicioDoc.id}/Users`);
          const usersSnapshot = await getDocs(usersCollection);
          usersSnapshot.forEach(userDoc => {
            this.users.push({ id: userDoc.id, ...userDoc.data() } as User); // Asigna manualmente el id de cada userDoc
          });
        }
      }
      
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
    }
  }

  private isInMisPerfilesServicio(): boolean {
    return window.location.pathname.includes('/mis-perfiles-servicio');
  }

  onCardClick(user: User) {
    this.router.navigate([`/perfil-servicio/${user.id}`]);
  }
}
