import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loginComponent } from './Components/Login/login';
import { RegistroServiciosComponent } from './Components/registro-servicios/registro-servicios.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { SearchbarComponent } from './Components/searchbar/searchbar.component';
import { ShortcategoriesComponent } from './Components/shortcategories/shortcategories.component';
import { GeneralviewComponent } from './Components/generalview/generalview.component';
import { DevsComponent } from './Components/devs/devs.component';
import { loginguard } from './Components/guards/login.guard';
import { PerfilComponent } from './Components/perfil/perfil.component';
import { PerfilesServiciosComponent } from './Components/perfiles-servicios/perfiles-servicios.component';

const routes: Routes = [
  { path: '', component: loginComponent },
  { path: 'servicesregistro', component: RegistroServiciosComponent, canActivate: [loginguard]},
  { path: 'home', component: GeneralviewComponent, canActivate: [loginguard]},
  { path: 'perfil', component: PerfilComponent, canActivate: [loginguard]},
  { path: 'perfilesServicio', component: PerfilesServiciosComponent, canActivate: [loginguard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
