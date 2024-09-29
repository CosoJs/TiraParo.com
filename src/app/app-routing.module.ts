import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loginComponent } from './Components/Login/login';
import { registroServicios } from './Components/Login/registroServicios'

const routes: Routes = [{ path: '', component: loginComponent },
  { path: 'servicesregistro', component: registroServicios }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
