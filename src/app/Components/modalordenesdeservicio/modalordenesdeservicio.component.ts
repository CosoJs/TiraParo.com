import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-modalordenesdeservicio',
  templateUrl: './modalordenesdeservicio.component.html',
  styleUrls: ['./modalordenesdeservicio.component.css']
})
export class ModalordenesdeservicioComponent implements OnInit {
  clienteNombre: string = '';
  servicioDescripcion: string = '';
  tareaNombre: string = '';
  usuarioNombre: string = '';
  fechaInicioFormatted: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalordenesdeservicioComponent>,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.obtenerNombreCliente();
    this.obtenerDescripcionServicio();
    this.obtenerNombreTarea();
    this.obtenerNombreUsuario();
    this.formatearFechaInicio();
  }

  formatearFechaInicio(): void {
    if (this.data.fechaInicio && this.data.fechaInicio.seconds) {
      const date = new Date(this.data.fechaInicio.seconds * 1000); // Convertir segundos a milisegundos
      this.fechaInicioFormatted = date.toLocaleDateString('es-ES'); // Formato 'dd/MM/yyyy'
    }
  }

  async obtenerNombreCliente(): Promise<void> {
    try {
      const clienteRef = doc(this.firestore, `users/${this.data.cliente}`);
      const clienteSnap = await getDoc(clienteRef);
      if (clienteSnap.exists()) {
        this.clienteNombre = clienteSnap.data()?.['Nombre'] || '';
      }
    } catch (error) {
      console.error("Error al obtener el nombre del cliente:", error);
    }
  }

  async obtenerDescripcionServicio(): Promise<void> {
    try {
      const servicioRef = doc(this.firestore, `users/${this.data.usuarioId}/Servicios/${this.data.servicioId}`);
      const servicioSnap = await getDoc(servicioRef);
      if (servicioSnap.exists()) {
        this.servicioDescripcion = servicioSnap.data()?.['descripcion'] || '';
      }
    } catch (error) {
      console.error("Error al obtener la descripción del servicio:", error);
    }
  }

  async obtenerNombreTarea(): Promise<void> {
    try {
      const tareaRef = doc(this.firestore, `users/${this.data.usuarioId}/Servicios/${this.data.servicioId}/tareas/${this.data.tareaId}`);
      const tareaSnap = await getDoc(tareaRef);
      if (tareaSnap.exists()) {
        this.tareaNombre = tareaSnap.data()?.['nombre'] || '';
      }
    } catch (error) {
      console.error("Error al obtener el nombre de la tarea:", error);
    }
  }

  async obtenerNombreUsuario(): Promise<void> {
    try {
      const usuarioRef = doc(this.firestore, `users/${this.data.usuarioId}`);
      const usuarioSnap = await getDoc(usuarioRef);
      if (usuarioSnap.exists()) {
        this.usuarioNombre = usuarioSnap.data()?.['Nombre'] || '';
      }
    } catch (error) {
      console.error("Error al obtener el nombre del usuario:", error);
    }
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }

  async marcarComoCompletado(): Promise<void> {
    try {
      // Referencias a ambas ubicaciones en Firestore
      const ordenProveedorRef = doc(this.firestore, `users/${this.data.usuarioId}/reservas/${this.data.id}`);
      const ordenClienteRef = doc(this.firestore, `users/${this.data.cliente}/misreservas/${this.data.id}`);
  
      // Actualizar el campo 'estado' a 'Completado' en ambas rutas
      await Promise.all([
        updateDoc(ordenProveedorRef, { estado: 'Completado' }),
        updateDoc(ordenClienteRef, { estado: 'Completado' })
      ]);
  
      // Cambiar el estado localmente para reflejar el cambio en la vista
      this.data.estado = 'Completado';
  
      // Cerrar el modal
      this.dialogRef.close();
    } catch (error) {
      console.error("Error al marcar como completado:", error);
    }
  }
  
}
