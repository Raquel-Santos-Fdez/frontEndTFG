import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeComponent } from './vistas/home/home.component';
import { LoginComponent } from './vistas/login/login.component';
import { NavComponent } from './fragments/nav/nav.component';
import { FooterComponent } from './fragments/footer/footer.component';
import { InicioComponent } from './vistas/inicio/inicio.component';

import { HttpClientModule } from '@angular/common/http';
import {routing} from './app.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialExampleModule } from '../material.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { HorariosComponent } from './vistas/horarios/horarios.component';
import { MapaComponent } from './vistas/horarios/mapa/mapa.component';

import {GoogleMapsModule} from '@angular/google-maps';

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
    GoogleMapsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})



export class AppModule { }
