import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment'; // Asegúrate de que la ruta sea correcta
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClipboardList, faUserCheck, faClipboardCheck, faCheckSquare } from '@fortawesome/free-solid-svg-icons';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { loginComponent } from './Components/Login/login';
import { CardsComponent } from './Components/cards/cards.component';
import { DevsComponent } from './Components/devs/devs.component';
import { SectionComponent } from './Components/section/section.component';
import { FooterComponent } from './Components/footer/footer.component';
import { CirclesComponent } from './Components/circles/circles.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { SearchbarComponent } from './Components/searchbar/searchbar.component';
import { ShortcategoriesComponent } from './Components/shortcategories/shortcategories.component';
import { GeneralviewComponent } from './Components/generalview/generalview.component';
import { PerfilComponent } from './Components/perfil/perfil.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { RegistroServiciosComponent } from './Components/registro-servicios/registro-servicios.component';
import { PerfilesServiciosComponent } from './Components/perfiles-servicios/perfiles-servicios.component';
import { ServicioDeUsuariosComponent } from './Components/servicio-de-usuarios/servicio-de-usuarios.component';
import { TareaModalComponent } from './Components/tarea-modal/tarea-modal.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { PerfilcardsComponent } from './Components/perfilcards/perfilcards.component';
import { HttpClientModule } from '@angular/common/http';
import { InvoiceComponent } from './Components/invoice/invoice.component';
import { TareascardComponent } from './Components/tareascard/tareascard.component';
import { BookingComponent } from './Components/booking/booking.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { OrdenesComponent } from './Components/orders/orders.component';
import { EditarServicioComponent } from './Components/editar-servicio/editar-servicio.component';
import { ModalordenesdeservicioComponent } from './Components/modalordenesdeservicio/modalordenesdeservicio.component';
import { CalendarComponent } from './Components/calendar/calendar.component';
import { Orders2Component } from './Components/orders2/orders2.component';

@NgModule({
  declarations: [
    AppComponent,
    loginComponent,
    CardsComponent,
    DevsComponent,
    SectionComponent,
    FooterComponent,
    CirclesComponent,
    SidebarComponent,
    SearchbarComponent,
    ShortcategoriesComponent,
    GeneralviewComponent,
    PerfilComponent,
    RegistroServiciosComponent,
    PerfilesServiciosComponent,
    ServicioDeUsuariosComponent,
    TareaModalComponent,
    PerfilcardsComponent,
    InvoiceComponent,
    TareascardComponent,
    BookingComponent,
    OrdenesComponent,
    EditarServicioComponent,
    ModalordenesdeservicioComponent,
    CalendarComponent,
    Orders2Component,
  ],
  imports: [
    FontAwesomeModule,
    BrowserModule,
    NgxDaterangepickerMd.forRoot(),
    AppRoutingModule,
    FormsModule,
    CommonModule,
    MatDialogModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFireAuthModule,
    HttpClientModule,
  ],
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faClipboardList, faUserCheck, faClipboardCheck, faCheckSquare);
  }
}
/**sfsfafds */