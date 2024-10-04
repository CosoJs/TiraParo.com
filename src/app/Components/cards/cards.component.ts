import { style } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css'],
})
export class CardsComponent {
  slides = [
    {
      title: '¿Quienes somos?',
      description: `
      En tiraparo.com, somos el vínculo entre quienes buscan servicios confiables y profesionales altamente capacitados en una amplia variedad de oficios. Nuestra misión es ofrecer una experiencia de contratación fácil, segura y de calidad, tanto para tu hogar como para tu negocio.
      <br>
      <br>
      Contamos con un equipo de expertos listos para respaldar cualquier proyecto, asegurando un servicio excepcional y soluciones adaptadas a tus necesidades.
      <br>
      <br>
      Confía en tiraparo.com para conectar con el profesional ideal para tu próximo proyecto.`,
      footnote: '',
      image: '',
      videoUrl:
        'https://firebasestorage.googleapis.com/v0/b/serchalakeshh.appspot.com/o/fondo%2Fartesano1.mp4?alt=media&token=847b5810-cb47-4d73-8336-721a42a140d0', // Firebase video URL
      isVideo: true,
    },
    {
      title: '¿Como funciona?',
      description: `En tiraparo.com, nos dedicamos a conectar a profesionales como tú con una amplia base de clientes que buscan servicios de calidad. Nuestro objetivo es facilitarte el acceso a nuevas oportunidades de trabajo y ayudarte a expandir tu negocio sin complicaciones.
      <br>
      <br>
      Trabajamos bajo un modelo sencillo y transparente: solo cobramos un 5% sobre el costo de tu mano de obra al mes, sin incluir gastos adicionales como materiales o transporte. 
      <br>
      <br>
      Esto significa que solo pagas por los trabajos que realizas, y siempre mantienes el control total sobre tu presupuesto y tarifas.
      <br>
      <br>`,
      footnote: '',
      image: '',
      videoUrl:
        'https://firebasestorage.googleapis.com/v0/b/serchalakeshh.appspot.com/o/fondo%2Ftools.mp4?alt=media&token=3d68147e-d22f-420c-9130-78ede9dce2b6', // Firebase video URL
      isVideo: true,
    },
    {
      title: 'Ventajas para profesionales',
      description: `Acceso a una amplia base de clientes: Conecta con personas que buscan tus servicios en tu área, aumentando tus oportunidades de negocio.
      <br>
      <br>
      Modelo de comisión transparente: Solo cobramos un 5% sobre el costo de tu mano de obra al mes, sin incluir materiales o transporte, asegurando que solo pagues por los trabajos realizados.
      <br>
      <br>
      Facilidad para gestionar tus trabajos: Utiliza nuestra plataforma para organizar tus solicitudes, comunicarte con los clientes y gestionar tus proyectos de forma sencilla.
      <br>
      <br>`,
      footnote: '',
      image: '',
      videoUrl: `https://firebasestorage.googleapis.com/v0/b/serchalakeshh.appspot.com/o/fondo%2Fsierra.mp4?alt=media&token=852b7b0a-516a-4d3f-a3ab-91069c9f37e7`,
      isVideo: true,
    },
    {
      title: '¿Que ofrecemos a los clientes?',
      description: `Acceso a profesionales calificados: Encuentra expertos en una amplia variedad de servicios y oficios, desde carpintería y plomería hasta electricidad y más, todo en un solo lugar.
      <br>
      <br>
      Búsqueda fácil y rápida: Utiliza nuestra plataforma para encontrar el profesional ideal según tus necesidades, presupuesto y ubicación, ahorrando tiempo y esfuerzo.
      <br>
      <br>
      Valoraciones y reseñas: Revisa las opiniones de otros clientes para asegurarte de que estás eligiendo a un profesional de confianza y calidad.,
      <br>
      <br>`,
      footnote: '',
      image: '',
      videoUrl: `https://firebasestorage.googleapis.com/v0/b/serchalakeshh.appspot.com/o/fondo%2Fguitarra.mp4?alt=media&token=63fbafbe-ccf5-476f-8940-1c0de213603e`,
      isVideo: true,
    },
  ];

  currentSlide = 0;

  goToSlide(index: number) {
    this.currentSlide = index;
  }
}
