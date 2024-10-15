import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment'; // Asegúrate de que la ruta sea correcta

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
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFireAuthModule,],
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
