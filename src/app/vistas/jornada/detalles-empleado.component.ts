import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Empleado} from "../../model/empleado/empleado";

export interface DialogData {
  empleado: Empleado
}

@Component({
  selector: 'detalles-empleado',
  templateUrl: './dialog-detalles-empleado.html',
  styleUrls: ['./detalles-empleado.component.css']
})
export class DetallesEmpleadoComponent {

  employee:Empleado;

  constructor(public dialogRef: MatDialogRef<DetallesEmpleadoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
    this.employee=this.data.empleado
  }

}
