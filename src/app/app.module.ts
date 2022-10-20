import {Injectable, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {HomeComponent} from './vistas/home/home.component';
import {LoginComponent} from './vistas/login/login.component';
import {NavComponent} from './fragments/nav/nav.component';
import {FooterComponent} from './fragments/footer/footer.component';

import {HTTP_INTERCEPTORS, HttpClientModule, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {routing} from './app.routing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialExampleModule} from '../material.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatTableModule} from "@angular/material/table";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatInputModule} from '@angular/material/input';
import {NgImageSliderModule} from 'ng-image-slider';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ReactiveFormsModule} from '@angular/forms';

import {HorariosComponent} from './vistas/horarios/horarios.component';
import {MapaComponent} from './vistas/horarios/mapa/mapa.component';
import {TablaHorariosComponent} from './vistas/horarios/tabla-horarios/tabla-horarios.component';
import {
  ConsultarJornadaComponent,
  DialogDetallesJornada
} from './vistas/jornada/consultar-jornada/consultar-jornada.component';

import {HorariosModule} from "./vistas/horarios/horarios.module";

import {GoogleMapsModule} from '@angular/google-maps';

import {FormsModule} from "@angular/forms";
import {SolicitarVacacionesComponent} from './vistas/jornada/solicitar-vacaciones/solicitar-vacaciones.component';
import {
  DialogNuevaSolicitud,
  PortalSolicitudesComponent
} from './vistas/jornada/portal-solicitudes/portal-solicitudes.component';
import {VerSolicitudesComponent} from './vistas/jornada/ver-solicitudes/ver-solicitudes.component';
import {PerfilComponent} from './vistas/perfil/perfil.component';
import {
  GestUsuariosJornadasComponent
} from './vistas/jornada/gest-usuarios-jornadas/gest-usuarios-jornadas.component';
import {FilterPipe} from "./vistas/jornada/gest-usuarios-jornadas/filter.pipe";
import {GestUsuariosJornadasModule} from "./vistas/jornada/gest-usuarios-jornadas/gest-usuarios-jornadas.module";
import {DetallesEmpleadoModule} from "./vistas/jornada/detalles-empleado.module";
import {MatExpansionModule} from '@angular/material/expansion';
import {PerfilModule} from "./vistas/perfil/perfil.module";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NavComponent,
    FooterComponent,
    HorariosComponent,
    MapaComponent,
    TablaHorariosComponent,
    ConsultarJornadaComponent,
    SolicitarVacacionesComponent,
    PortalSolicitudesComponent,
    DialogNuevaSolicitud,
    VerSolicitudesComponent,
    DialogDetallesJornada,
    PerfilComponent,
    GestUsuariosJornadasComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    routing,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatIconModule,
    MaterialExampleModule,
    MatMenuModule,
    GoogleMapsModule,
    HorariosModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatDatepickerModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatInputModule,
    NgImageSliderModule,
    MatSelectModule,
    MatTooltipModule,
    DetallesEmpleadoModule,
    PerfilModule,
    GestUsuariosJornadasModule,
    MatExpansionModule,
    MatProgressSpinnerModule

  ],
  providers: [
    // AppService, { provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
