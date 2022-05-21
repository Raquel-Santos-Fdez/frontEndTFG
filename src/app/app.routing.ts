import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from "./vistas/home/home.component";
import {LoginComponent} from "./vistas/login/login.component";
import {InicioComponent} from "./vistas/inicio/inicio.component";
import {HorariosComponent} from "./vistas/horarios/horarios.component";

const routes:Routes =[
  {
    path:'',
    component: HomeComponent
  },
  {
    path:'login',
    component: LoginComponent
  },
  {
    path:'inicio',
    component: InicioComponent
  },
  {
    path:'horarios',
    component: HorariosComponent
  }
];

export const routing=RouterModule.forRoot(routes);
