import {Jornada} from "../../../model/jornada/jornada";
import {Component, Inject} from "@angular/core";
import {Tarea} from "../../../model/tarea/tarea";
import {Estacion} from "../../../model/estacion/estacion";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {JornadaService} from "../../../services/jornada.service";
import {TrenService} from "../../../services/tren.service";
import {EstacionService} from "../../../services/estacion.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {GestUsuariosJornadasComponent} from "./gest-usuarios-jornadas.component";
import {Empleado} from "../../../model/empleado/empleado";
import {Situacion, Tarea_estacion} from "../../../model/tarea/tarea_estacion";
import {Tren} from "../../../model/tren/tren";
import {RutaService} from "../../../services/ruta.service";
import {Ruta_estacion} from "../../../model/ruta_estacion/ruta_estacion";

export interface DialogData {
  jornada: Jornada,
  gestorUsuariosJornadas: GestUsuariosJornadasComponent,
  diaSeleccionado: Date,
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
  tareaEstacion: Tarea_estacion;
  trenes: Tren[] = [];

  formulario = new FormGroup({
      anden: new FormControl('', [Validators.required, Validators.maxLength(2)]),
      descripcion: new FormControl('', [Validators.required]),
      horaInicio: new FormControl('', [Validators.required]),
      horaFin: new FormControl('', [Validators.required]),
      origen: new FormControl('', [Validators.required]),
      destino: new FormControl('', [Validators.required]),
      tren: new FormControl('', [Validators.required]),
    },
    this.validarHorario
  );

  constructor(
    public dialogRef: MatDialogRef<NuevaTareaDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private jornadaService: JornadaService,
    private trenService: TrenService,
    private estacionService: EstacionService,
    private _snackBar: MatSnackBar,
    private rutaService: RutaService
  ) {
    this.estacionService.findAllEstaciones().subscribe(data => {
      this.estaciones = data
    });

    this.trenService.getAllTrenes().subscribe(data => this.trenes = data);
  }

  addNuevaTarea() {
    if (this.formulario.valid && !this.comprobarHorarios() && !this.comprobarEstaciones()) {
      this.tarea.tren = this.tren;

      if (!this.data.jornada) {
        let fecha2 = this.data.diaSeleccionado
        this.data.jornada = new Jornada(fecha2, this.data.empleadoSeleccionado);
      }
        this.comprobarCoincidenciaHorario();

    }
  }

  comprobarCoincidenciaHorario(){
    this.jornadaService.existeTarea(this.data.diaSeleccionado, this.data.empleadoSeleccionado.id, this.tarea.horaSalida, this.tarea.horaFin).subscribe(data=>{
        let existe=data;
        if(!existe) {
          this.tarea.stops.push(new Tarea_estacion(Situacion.FINAL, this.destino));
          this.tarea.stops.push(new Tarea_estacion(Situacion.INICIO, this.origen));

          this.data.jornada.tareas.push(this.tarea);
          this.jornadaService.addJornada(this.data.jornada).subscribe();

          this.dialogRef.close()
          this._snackBar.open("Tarea añadida correctamente", undefined, {duration: 2000});
          setTimeout(() => this.data.gestorUsuariosJornadas.seleccionarDia(), 200);
        }
        else{
          this._snackBar.open("Ya existe una tarea en este horario", undefined, {duration: 2000});

        }
    });

  }

  validarHorario(group: any) {
    if (group.controls.horaInicio.value > group.controls.horaFin.value) {
      return {horarioInvalido: true};
    }
    return null;
  }

  comprobarHorarios(): boolean {
    return this.formulario.hasError("horarioInvalido");
  }

  validarRuta(group: any) {
    let rutasConjuntas: Ruta_estacion[] = [];
    let origen = group.controls.origen.value;
    let destino = group.controls.destino.value;

    if (origen && destino) {
      this.rutaService.findRutaByEstacion(origen.id, destino.id).subscribe(data => {
        rutasConjuntas = data
        if (rutasConjuntas.length == 0) {
          this.formulario.controls["destino"].setErrors({rutaInvalida: true})
        }
        this.addNuevaTarea()
      })
    }
  }

  comprobarEstaciones() {
    return this.formulario.controls["destino"].hasError("rutaInvalida");
  }
}
