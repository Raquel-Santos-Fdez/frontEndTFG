import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {DetallesEmpleadoComponent} from "./detalles-empleado.component";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";


@NgModule({
  declarations: [
    DetallesEmpleadoComponent,

],
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    MatInputModule

  ],
  providers: [

  {
    provide: MatDialogRef,
    useValue: {}
  },
    {
      provide: MAT_DIALOG_DATA,
      useValue: {}
    }
  ],
})
export class DetallesEmpleadoModule { }
