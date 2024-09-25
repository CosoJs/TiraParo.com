import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment'; // Asegúrate de que la ruta sea correcta

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { loginComponent } from './Components/Login/login';

@NgModule({
  declarations: [AppComponent, loginComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
