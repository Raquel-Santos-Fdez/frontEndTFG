import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {EmpleadosService} from "../../../services/empleados.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Tarea} from "../../../model/tarea/tarea";
import {Estacion} from "../../../model/estacion/estacion";

export interface DetallesJornadaIntercambioData {
  tareas: Tarea[];
}

@Component({
  selector: 'detalles-jornada-intercambio',
  templateUrl: './detalles-jornada-intercambio.html',
  styleUrls: ['./portal-solicitudes.component.css']
})
export class DetallesJornadaIntercambioComponent {

  dataSource: { tarea: Tarea, origen: Estacion, destino: Estacion }  [] = [];
  displayedColumns: string[] = ["descripcion", "horario", "origen", "destino"]

  constructor(
    public dialogRef: MatDialogRef<DetallesJornadaIntercambioComponent>,
    private employeeService: EmpleadosService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DetallesJornadaIntercambioData,
  ) {

    this.cargarDatos();
  }

  cargarDatos() {
    let inicio: Estacion;
    let final: Estacion;
    this.data.tareas.forEach(t => {
      t.stops.forEach(st => {
        if (st.situacion.toString() == "INICIO")
          inicio = st.estacion
        else
          final = st.estacion
      });
      this.dataSource.push({tarea: t, origen: inicio, destino: final})
    })
  }

}

