import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {DetallesEmpleadoComponent} from "./detalles-empleado.component";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    DetallesEmpleadoComponent,

],
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule

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
