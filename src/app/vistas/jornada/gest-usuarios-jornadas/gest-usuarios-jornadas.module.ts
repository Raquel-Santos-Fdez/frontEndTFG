import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NuevaTareaDialog, NuevoUsuarioDialog} from "./gest-usuarios-jornadas.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";


@NgModule({
  declarations: [
    NuevaTareaDialog,
    NuevoUsuarioDialog,

],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule

  ]
})
export class GestUsuariosJornadasModule { }
