import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs, doc } from '@angular/fire/firestore';

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
  users: User[] = []; // Lista de usuarios que se cargará

  constructor(private firestore: Firestore) {}

  async ngOnInit() {
    const userId = localStorage.getItem('UsuarioId'); // Obtener el ID del usuario del localStorage
    if (!userId) {
      console.error("Usuario no identificado.");
      return;
    }

    try {
      // Verificar si estamos en el componente /mis-perfiles-servicio
      const isMisPerfilesServicio = this.isInMisPerfilesServicio(); // Implementa esta lógica según tu ruta

      if (isMisPerfilesServicio) {
        // Cargar servicios del usuario específico
        const userServicesCollection = collection(this.firestore, `users/${userId}/Servicios`);
        const userServicesSnapshot = await getDocs(userServicesCollection);

        // Iterar sobre cada servicio del usuario y agregarlos al array
        userServicesSnapshot.forEach(serviceDoc => {
          this.users.push({ id: serviceDoc.id, ...serviceDoc.data() } as User);
        });
      } else {
        // Obtener la colección de Servicios
        const serviciosCollection = collection(this.firestore, 'Servicios');
        const serviciosSnapshot = await getDocs(serviciosCollection);

        // Iterar sobre cada documento de 'Servicios'
        for (const servicioDoc of serviciosSnapshot.docs) {
          const usersCollection = collection(this.firestore, `Servicios/${servicioDoc.id}/Users`);
          const usersSnapshot = await getDocs(usersCollection);

          // Iterar sobre cada usuario en la subcolección 'Users' y agregarlos al array
          usersSnapshot.forEach(userDoc => {
            this.users.push(userDoc.data() as User);
          });
        }
      }
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
    }
  }

  // Implementa esta función para verificar si estás en el componente correcto
  private isInMisPerfilesServicio(): boolean {
    // Aquí puedes usar el router o alguna lógica para verificar la ruta actual
    return window.location.pathname.includes('/mis-perfiles-servicio');
  }
}
