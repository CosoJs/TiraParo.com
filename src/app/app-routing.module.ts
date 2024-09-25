import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loginComponent } from './Components/Login/login';

const routes: Routes = [{ path: '', component: loginComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
