import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface TaskData {
  descripcion: string;
  nombre: string;
  precio: number;
  imagenes?: string[];
}

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
})
export class InvoiceComponent implements OnInit {
  isSidebarExpanded: boolean = false;
  invoiceData: any[] = [];
  subtotal: number = 0;
  totalCommission: number = 0;
  total: number = 0;

  constructor(private firestore: AngularFirestore) {}

  ngOnInit() {
    this.fetchCompletedReservations();
  }

  expandSidebar() {
    this.isSidebarExpanded = true;
  }

  collapseSidebar() {
    this.isSidebarExpanded = false;
  }

  // Método para obtener datos de Firebase
  fetchCompletedReservations() {
    const userId = localStorage.getItem('UsuarioId'); // Asegúrate de que UsuarioId esté almacenado en localStorage

    if (!userId) {
      console.error('UsuarioId no encontrado en localStorage.');
      return;
    }

    this.firestore
      .collection(`users/${userId}/reservas`, (ref) =>
        ref.where('estado', '==', 'Completado')
      )
      .get()
      .subscribe((snapshot) => {
        const reservations = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any), // Aseguramos que doc.data() es tratado como un objeto
        }));

        this.processReservations(reservations);
      });
  }

  processReservations(reservations: any[]) {
    const invoiceItems: any[] = [];
    let subtotal = 0;

    reservations.forEach((reservation) => {
      const { servicioId, tareaId, usuarioId } = reservation;

      this.firestore
        .doc<TaskData>(`users/${usuarioId}/Servicios/${servicioId}/tareas/${tareaId}`)
        .get()
        .subscribe((taskDoc) => {
          if (taskDoc.exists) {
            const taskData = taskDoc.data() as TaskData;
            const price = taskData?.precio || 0;
            const commission = price * 0.05;
            const totalItem = price - commission;

            invoiceItems.push({
              id: reservation.id,
              description: taskData.nombre || 'Sin descripción',
              price,
              commission,
              total: totalItem,
            });

            subtotal += price;
            this.totalCommission += commission;
            this.total = subtotal - this.totalCommission;

            this.invoiceData = invoiceItems;
            this.subtotal = subtotal;
          }
        });
    });
  }

  // Método para generar el PDF
  downloadPDF() {
    const invoice = document.getElementById('invoice-container'); // Elemento a capturar

    if (invoice) {
      html2canvas(invoice).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = pdf.internal.pageSize.getWidth() - 20; // Ajusta el ancho de imagen
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.save('invoice.pdf'); // Nombre del archivo PDF
      });
    }
  }
}
