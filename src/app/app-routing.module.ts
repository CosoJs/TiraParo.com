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
import { ServicioDeUsuariosComponent } from './Components/servicio-de-usuarios/servicio-de-usuarios.component';
import { InvoiceComponent } from './Components/invoice/invoice.component';
import { BookingComponent } from './Components/booking/booking.component';
import { OrdenesComponent } from './Components/orders/orders.component';
import { Orders2Component } from './Components/orders2/orders2.component';
import { EditarServicioComponent } from './Components/editar-servicio/editar-servicio.component';
import { CalendarComponent } from './Components/calendar/calendar.component';

const routes: Routes = [
  { path: '', component: loginComponent },
  { path: 'edit/:id', component: EditarServicioComponent },
  {
    path: 'servicesregistro',
    component: RegistroServiciosComponent,
    canActivate: [loginguard],
  },
  { path: 'home', component: GeneralviewComponent, canActivate: [loginguard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [loginguard] },
  {
    path: 'mis-perfiles-servicio',
    component: PerfilesServiciosComponent,
    canActivate: [loginguard],
  },
  {
    path: 'Servicio-De-Usuarios',
    component: ServicioDeUsuariosComponent,
    canActivate: [loginguard],
  },
  {
    path: 'invoice',
    component: InvoiceComponent,
    canActivate: [loginguard],
  },
  { path: 'booking/:id', component: BookingComponent },
  {path: 'Agenda', component: OrdenesComponent},
  {path: 'Ordenes de servicio', component: Orders2Component},
  {path: 'calendar', component: CalendarComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
