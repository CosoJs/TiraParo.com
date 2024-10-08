import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment'; // Asegúrate de que la ruta sea correcta

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { loginComponent } from './Components/Login/login';
import { registroServicios } from './Components/Login/registroServicios';
import { CardsComponent } from './Components/cards/cards.component';
import { DevsComponent } from './Components/devs/devs.component';
import { SectionComponent } from './Components/section/section.component';
import { FooterComponent } from './Components/footer/footer.component';
import { CirclesComponent } from './Components/circles/circles.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    loginComponent,
    CardsComponent,
    registroServicios,
    DevsComponent,
    SectionComponent,
    FooterComponent,
    CirclesComponent,
    SidebarComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
