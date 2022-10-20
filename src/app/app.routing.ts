import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from "./vistas/home/home.component";
import {LoginComponent} from "./vistas/login/login.component";
import {HorariosComponent} from "./vistas/horarios/horarios.component";
import {ConsultarJornadaComponent} from "./vistas/jornada/consultar-jornada/consultar-jornada.component";
import {SolicitarVacacionesComponent} from "./vistas/jornada/solicitar-vacaciones/solicitar-vacaciones.component";
import {PortalSolicitudesComponent} from "./vistas/jornada/portal-solicitudes/portal-solicitudes.component";
import {VerSolicitudesComponent} from "./vistas/jornada/ver-solicitudes/ver-solicitudes.component";
import {PerfilComponent} from "./vistas/perfil/perfil.component";
import {GestUsuariosJornadasComponent} from "./vistas/jornada/gest-usuarios-jornadas/gest-usuarios-jornadas.component";

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
    path:'horarios',
    component: HorariosComponent
  },
  {
    path:'tabla-horarios',
    loadChildren: ()=>
      import ('./vistas/horarios/horarios.module').then((h)=> h.HorariosModule),
  },
  {
    path: 'consultar-jornada',
    component: ConsultarJornadaComponent
  },
  {
    path: 'solicitar-vacaciones',
    component: SolicitarVacacionesComponent
  },
  {
    path: 'portal-solicitudes',
    component: PortalSolicitudesComponent
  },
  {
    path: 'ver-solicitudes',
    component: VerSolicitudesComponent
  },
  {
    path:'ver-perfil',
    component: PerfilComponent
  },
  {
    path:'gestionar-usuarios-jornadas',
    component: GestUsuariosJornadasComponent
  }
];

export const routing=RouterModule.forRoot(routes);
