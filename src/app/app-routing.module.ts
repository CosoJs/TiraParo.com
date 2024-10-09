import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loginComponent } from './Components/Login/login';
import { registroServicios } from './Components/Login/registroServicios';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { SearchbarComponent } from './Components/searchbar/searchbar.component';
import { ShortcategoriesComponent } from './Components/shortcategories/shortcategories.component';
import { GeneralviewComponent } from './Components/generalview/generalview.component';

const routes: Routes = [
  { path: '', component: loginComponent },
  { path: 'servicesregistro', component: registroServicios },
  { path: 'home', component: GeneralviewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
