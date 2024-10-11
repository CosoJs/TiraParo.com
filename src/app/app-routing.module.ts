import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loginComponent } from './Components/Login/login';
import { registroServicios } from './Components/Login/registroServicios';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { SearchbarComponent } from './Components/searchbar/searchbar.component';
import { ShortcategoriesComponent } from './Components/shortcategories/shortcategories.component';
import { GeneralviewComponent } from './Components/generalview/generalview.component';
import { DevsComponent } from './Components/devs/devs.component';
import { loginguard } from './Components/guards/login.guard';

const routes: Routes = [
  { path: '', component: loginComponent },
  { path: 'servicesregistro', component: registroServicios, canActivate: [loginguard]},
  { path: 'home', component: GeneralviewComponent, canActivate: [loginguard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
