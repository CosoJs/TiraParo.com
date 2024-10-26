import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDoc, query, where, getDocs } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

interface Servicio {
  servicio: string;
  categoria: string;
  [key: string]: any; // Permite que el objeto tenga más propiedades
}

@Component({
  selector: 'app-shortcategories',
  templateUrl: './shortcategories.component.html',
  styleUrls: ['./shortcategories.component.css']
})
export class ShortcategoriesComponent implements OnInit {
  servicios$!: Observable<any[]>; 
  categoria: string = ''; 
  usuarioId: string = ''; 
  esPerfilServicio: boolean = false; 

  constructor(private firestore: Firestore, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.esPerfilServicio = this.router.url.includes('/mis-perfiles-servicio');
    this.usuarioId = localStorage.getItem('UsuarioId') || ''; 

    if (this.esPerfilServicio) {
      this.cargarServiciosConPerfil();
    } else {
      const serviciosCollection = collection(this.firestore, 'Servicios');
      this.servicios$ = collectionData(serviciosCollection, { idField: 'id' });
    }
  }

  cargarServiciosConPerfil() {
    const serviciosCollection = collection(this.firestore, 'Servicios');

    collectionData(serviciosCollection, { idField: 'id' }).subscribe((servicios: any[]) => {
      servicios = servicios || [];

      servicios.push({
        id: 'Crear Perfil de servicio',
        Image: 'https://images.vexels.com/content/204937/preview/plus-symbol-stroke-27fb85.png'
      });

      this.servicios$ = of(servicios);
    });
  }

  onCardClick(servicio: any) {
    if (servicio.id === 'Crear Perfil de servicio') {
      this.router.navigate(['/servicesregistro']);
    } else if (servicio.docId) {  // Verificar si hay un `docId`
      this.router.navigate([`/perfil-servicio/${servicio.docId}`]); // Redirigir a `/perfil-servicio/:id`
    } else {
      this.LoadMyUsers(servicio.id);
    }
  }  

  async LoadMyUsers(categoriaSeleccionada: string) {
    this.categoria = categoriaSeleccionada;
      console.log(`Categoría seleccionada: ${this.categoria}`);
    
      // Limpiar servicios$ antes de la nueva carga
      this.servicios$ = of([]);
    
      // Función auxiliar para cargar servicios
      const cargarServicios = async (collectionRef: any) => {
          const querySnapshot = await getDocs(collectionRef);
          let servicios: any[] = [];
    
          for (let docSnap of querySnapshot.docs) {
              const servicioData = docSnap.data() as Servicio;
              const servicioNombre = servicioData.servicio; 
              const docId = docSnap.id; // Capturar el nombre del documento
              
              const categoriaDocRef = doc(this.firestore, `Servicios/${this.categoria}`);
              const categoriaDoc = await getDoc(categoriaDocRef);
    
              let imageUrl = '';
    
              if (categoriaDoc.exists()) {
                  const categoriaData = categoriaDoc.data();
                  if (categoriaData && categoriaData[servicioNombre]) {
                      imageUrl = categoriaData[servicioNombre];
                  }
              }
    
              servicios.push({
                  id: servicioNombre,
                  Image: imageUrl,
                  docId: docId // Añadir docId aquí para que esté disponible en el HTML
              });
          }
    
          return servicios;
      };
    
      if (!this.esPerfilServicio) {
          // Cargar usuarios de la categoría seleccionada
          console.log(`Cargando usuarios de la categoría: ${this.categoria}`);
    
          const usersCollectionRef = collection(this.firestore, `Servicios/${this.categoria}/Users`);
          const servicios = await cargarServicios(usersCollectionRef);
          this.servicios$ = of(servicios);
      } else {
          // Cargar servicios de usuario si es un perfil de servicio
          const userServiciosCollection = collection(this.firestore, `users/${this.usuarioId}/Servicios`);
          const q = query(userServiciosCollection, where("categoria", "==", this.categoria));
          const servicios = await cargarServicios(q);

          // Añadir el perfil de servicio adicional
          servicios.push({
              id: 'Crear Perfil de servicio',
              Image: 'https://images.vexels.com/content/204937/preview/plus-symbol-stroke-27fb85.png'
          });
    
          this.servicios$ = of(servicios);
      }
  }

  
}
