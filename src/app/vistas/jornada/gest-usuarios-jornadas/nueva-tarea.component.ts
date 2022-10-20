import {Jornada} from "../../../model/jornada/jornada";
import {Component, Inject} from "@angular/core";
import {Tarea} from "../../../model/tarea/tarea";
import {Estacion} from "../../../model/estacion/estacion";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {JornadaService} from "../../../servicios/jornada.service";
import {TrenService} from "../../../servicios/tren.service";
import {EstacionService} from "../../../servicios/estacion.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {GestUsuariosJornadasComponent} from "./gest-usuarios-jornadas.component";
import {Empleado} from "../../../model/empleado/empleado";
import {Situacion, Tarea_stop} from "../../../model/tarea/tarea_stop";
import {Tren} from "../../../model/tren/tren";

export interface DialogData {
  jornada: Jornada,
  gestorUsuariosJornadas: GestUsuariosJornadasComponent,
  diaSeleccionado: string,
  empleadoSeleccionado: Empleado
}

@Component({
  selector: 'nueva-tarea',
  templateUrl: './nueva-tarea.html',
  styleUrls: ['./gest-usuarios-jornadas.component.css']
})
export class NuevaTareaDialog {

  tarea: Tarea = new Tarea();
  time = {hour: 13, minute: 30};
  estaciones: Estacion[] = []
  origen: Estacion;
  destino: Estacion;
  tren: Tren;
  tareaStop: Tarea_stop;
  trenes: Tren[] = []

  formulario = new FormGroup({
    anden: new FormControl('', [Validators.required, Validators.maxLength(2)]),
    descripcion: new FormControl('', [Validators.required]),
    horaInicio: new FormControl('', [Validators.required]),
    horaFin: new FormControl('', [Validators.required]),
  });

  constructor(
    public dialogRef: MatDialogRef<NuevaTareaDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private jornadaService: JornadaService,
    private trenService: TrenService,
    private paradaService: EstacionService,
    private _snackBar: MatSnackBar
  ) {
    this.paradaService.findAllStops().subscribe(data => {
      this.estaciones = data
    });

    this.trenService.getAllTrenes().subscribe(data => this.trenes = data);
  }

  addNuevaTarea() {
    if (this.formulario.valid) {
      this.tarea.tren = this.tren;

      if (!this.data.jornada) {
        let fecha2 = new Date(this.data.diaSeleccionado)
        this.data.jornada = new Jornada(fecha2, this.data.empleadoSeleccionado);
      }

      this.tarea.stops.push(new Tarea_stop(Situacion.FINAL, this.destino));
      this.tarea.stops.push(new Tarea_stop(Situacion.INICIO, this.origen));

      this.data.jornada.tareas.push(this.tarea);
      this.jornadaService.addJornada(this.data.jornada).subscribe();

      this.dialogRef.close()
      this._snackBar.open("Tarea añadida correctamente", undefined, {duration: 2000});
      setTimeout(() => this.data.gestorUsuariosJornadas.seleccionarDia(), 200);

    }
  }
}
