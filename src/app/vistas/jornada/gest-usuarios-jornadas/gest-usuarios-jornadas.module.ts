import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NuevoUsuarioDialog} from "./gest-usuarios-jornadas.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {GestUsuariosJornadasRouting} from "./gest-usuarios-jornadas.routing";
import {NuevaTareaDialog} from "./nueva-tarea.component";
import {MatTableModule} from "@angular/material/table";
import {MatGridListModule} from '@angular/material/grid-list';


@NgModule({
  declarations: [
    NuevaTareaDialog,
    NuevoUsuarioDialog

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
    MatButtonModule,
    GestUsuariosJornadasRouting,
    FormsModule,
    MatTableModule,
    MatGridListModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'})

  ]
})
export class GestUsuariosJornadasModule { }
