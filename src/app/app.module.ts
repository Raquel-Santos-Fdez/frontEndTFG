import {Injectable, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeComponent } from './vistas/home/home.component';
import { LoginComponent } from './vistas/login/login.component';
import { NavComponent } from './fragments/nav/nav.component';
import { FooterComponent } from './fragments/footer/footer.component';
import { InicioComponent } from './vistas/inicio/inicio.component';

import {HTTP_INTERCEPTORS, HttpClientModule, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {routing} from './app.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialExampleModule } from '../material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from "@angular/material/table";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';

import { HorariosComponent } from './vistas/horarios/horarios.component';
import { MapaComponent } from './vistas/horarios/mapa/mapa.component';
import { TablaHorariosComponent } from './vistas/horarios/tabla-horarios/tabla-horarios.component';
import { ConsultarJornadaComponent } from './vistas/jornada/consultar-jornada/consultar-jornada.component';

import {HorariosModule} from "./vistas/horarios/horarios.module";

import {GoogleMapsModule} from '@angular/google-maps';

import {FormsModule} from "@angular/forms";
import { SolicitarVacacionesComponent } from './vistas/jornada/solicitar-vacaciones/solicitar-vacaciones.component';
// import {AppService} from "./app.service";

@NgModule({
  declarations: [
    AppComponent,

    HomeComponent,
    LoginComponent,
    NavComponent,
    FooterComponent,
    InicioComponent,
    HorariosComponent,
    MapaComponent,
    TablaHorariosComponent,
    ConsultarJornadaComponent,
    SolicitarVacacionesComponent,
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
    MatTableModule,
    MatDatepickerModule,
    MatCardModule,
    MatButtonModule

  ],
  providers: [
    // AppService, { provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})

// @Injectable()
// export class XhrInterceptor implements HttpInterceptor {
//
//   intercept(req: HttpRequest<any>, next: HttpHandler) {
//     const xhr = req.clone({
//       headers: req.headers.set('X-Requested-With', 'XMLHttpRequest')
//     });
//     return next.handle(xhr);
//   }
// }

export class AppModule { }
