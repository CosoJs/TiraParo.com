import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router'; // Importar ActivatedRoute y Router

@Component({
  selector: 'app-shortcategories',
  templateUrl: './shortcategories.component.html',
  styleUrls: ['./shortcategories.component.css']
})
export class ShortcategoriesComponent implements OnInit {
  servicios$!: Observable<any[]>; // Usa el operador ! para indicar que será asignado más tarde
  categoria: string = ''; // Variable para almacenar la categoría seleccionada
  usuarioId: string = ''; // Variable para almacenar el UsuarioId
  esPerfilServicio: boolean = false; // Bandera para saber si está en la ruta perfilesServicio

  constructor(private firestore: Firestore, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Verificar si la ruta actual es /perfilesServicio
    this.esPerfilServicio = this.router.url.includes('/perfilesServicio');

    // Obtener el UsuarioId del localStorage
    this.usuarioId = localStorage.getItem('UsuarioId') || ''; // Asegúrate de que el UsuarioId esté almacenado

    // Si estamos en /perfilesServicio, cargar los servicios y añadir la tarjeta "Crear Perfil de servicio" desde el inicio
    if (this.esPerfilServicio) {
      this.cargarServiciosConPerfil();
    } else {
      // En otras rutas, solo cargar los servicios sin añadir el "Crear Perfil de servicio"
      const serviciosCollection = collection(this.firestore, 'Servicios');
      this.servicios$ = collectionData(serviciosCollection, { idField: 'id' });
    }
  }

  // Método para cargar los servicios y añadir "Crear Perfil de servicio" en perfilesServicio
  cargarServiciosConPerfil() {
    const serviciosCollection = collection(this.firestore, 'Servicios');

    // Observa los datos desde Firestore y transforma el flujo con pipe
    collectionData(serviciosCollection, { idField: 'id' }).subscribe((servicios: any[]) => {
      // Si no hay servicios, inicializa como array vacío
      servicios = servicios || [];

      // Añadir siempre la tarjeta de "Crear Perfil de servicio"
      servicios.push({
        id: 'Crear Perfil de servicio',
        Image: 'https://images.vexels.com/content/204937/preview/plus-symbol-stroke-27fb85.png' // Link de la imagen por defecto
      });

      // Actualiza el observable con los servicios (datos encontrados más la tarjeta "Crear Perfil de servicio")
      this.servicios$ = of(servicios);
    });
  }

  // Método que se ejecuta al hacer clic en una tarjeta
  onCardClick(servicio: any) {
    if (servicio.id === 'Crear Perfil de servicio') {
      // Redirigir a la página de registro de servicios
      this.router.navigate(['/servicesregistro']);
    } else {
      // Ejecutar LoadMyUsers si es otro servicio
      this.LoadMyUsers(servicio.id);
    }
  }


  // Método para manejar el clic en una categoría
  async LoadMyUsers(categoriaSeleccionada: string) {
    // Solo ejecuta la lógica si estamos en /perfilesServicio
    if (!this.esPerfilServicio) {
      return; // No hacer nada si no estamos en la ruta /perfilesServicio
    }

    this.categoria = categoriaSeleccionada; // Guardar la categoría seleccionada
    console.log(`Categoría seleccionada: ${this.categoria}`);

    // Limpiar las tarjetas actuales
    this.servicios$ = of([]); // Esto limpiará las tarjetas actuales.

    // Ruta en Firestore: Servicios/{categoria}/Users/{usuarioId}
    const userDocRef = doc(this.firestore, `Servicios/${this.categoria}/Users/${this.usuarioId}`);
    const userDoc = await getDoc(userDocRef);

    let servicios: any[] = [];

    if (userDoc.exists()) {
      // Si existen datos, los añade al array de servicios
      console.log('Datos del usuario encontrados:', userDoc.data());
      servicios.push(userDoc.data());
    }

    // Añadir siempre la tarjeta de "Crear Perfil de servicio"
    servicios.push({
      id: 'Crear Perfil de servicio',
      Image: 'https://images.vexels.com/content/204937/preview/plus-symbol-stroke-27fb85.png' // Link de la imagen por defecto
    });

    // Actualiza el observable con los servicios (datos encontrados más la tarjeta "Crear Perfil de servicio")
    this.servicios$ = of(servicios);
  }
}
