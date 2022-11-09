import {Component, Inject, OnInit} from '@angular/core';
import {JornadaService} from "../../../services/jornada.service";
import {Tarea} from "../../../model/tarea/tarea";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Estacion} from "../../../model/estacion/estacion";
import {Incidencia} from "../../../model/incidencia/incidencia";
import {Empleado} from "../../../model/empleado/empleado";
import {TrenService} from "../../../services/tren.service";
import {Solicitud} from "../../../model/solicitud/solicitud";
import {SolicitudSimple} from "../../../model/solicitud/solicitudSimple";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DatePipe} from "@angular/common";
import {SolicitudService} from "../../../services/solicitud.service";

export interface DialogData {
  tarea: Tarea | undefined
  origen: Estacion | undefined
  final: Estacion | undefined
  incidencias: Incidencia[]
}

@Component({
  selector: 'app-consultar-jornada',
  templateUrl: './consultar-jornada.component.html',
  styleUrls: ['./consultar-jornada.component.css']
})
export class ConsultarJornadaComponent implements OnInit {

  selected: Date | null;

  tareasColumns:string[]=["descripcion", "detalles"]

  tareas: Tarea[] = [];
  tareaDetalle: Tarea = new Tarea();
  origen: Estacion | undefined;
  final: Estacion | undefined;

  incidencias: Incidencia[]

  isSelected: boolean = false;

  employee: Empleado;
  isLoggedIn: boolean = false;

  solicitud: Solicitud = new SolicitudSimple();
  motivoSeleccionado: string;
  isSolicitado: boolean = false;
  horaInicio: any;
  horaFin: any;

  isDiaLibre: boolean = false;

  constructor(private jornadaService: JornadaService,
              private trenService: TrenService,
              public dialog: MatDialog,
              private _snackBar: MatSnackBar,
              private solicitudService: SolicitudService) {

  }

  ngOnInit(): void {
    this.employee = JSON.parse(localStorage.getItem("usuario") || '{}');
    if (Object.keys(this.employee).length != 0)
      this.isLoggedIn = true;
  }

  verJornada() {
    this.tareas = [];
    this.incidencias = [];
    this.origen = undefined;
    this.final = undefined;

    let jornada;

    if (this.selected != null) {
      this.jornadaService.findJornadaByDateEmpleado(this.selected, this.employee.id).subscribe(data => {
        if (data[0]) {
          jornada = data[0];
          this.isDiaLibre = jornada.diaLibre;
        } else
          this.isDiaLibre = false;
      })

      this.jornadaService.findTareasByDateEmpleado(this.selected, this.employee.id).subscribe(data => {
        this.tareas = data
        this.isSelected = this.tareas.length > 0;
      });
    }

  }


  verDetalles(id: bigint) {

    this.loadData(id);

    setTimeout(() => {
      this.dialog.open(DialogDetallesJornada, {
        width: '450px',
        data: {
          tarea: this.tareaDetalle,
          origen: this.origen,
          final: this.final,
          incidencias: this.incidencias
        }
      })
    }, 500)
  }

  private loadData(id: bigint) {
    //mostramos la tarea seleccionada
    let i
    for (i = 0; i < this.tareas.length; i++)
      if (this.tareas[i].id == id)
        this.tareaDetalle = this.tareas[i]

    let j
    for (j = 0; j < this.tareaDetalle.stops.length; j++) {
      if (this.tareaDetalle.stops[j].situacion.toString() == "INICIO")
        this.origen = this.tareaDetalle.stops[j].estacion
      else
        this.final = this.tareaDetalle.stops[j].estacion
    }

    this.trenService.getIncidenciasPending(this.tareaDetalle.tren.id).subscribe((data: Incidencia[]) => {
      this.incidencias = data;
    })
  }

  solicitarDiaLibre() {
    let formulario: any = document.getElementById("formulario");
    let formularioValido: boolean = formulario.reportValidity();
    if (formularioValido) {
      let pipe = new DatePipe('en-US')
      let fecha_seleccionada = pipe.transform(this.selected, 'yyyy-MM-dd')
      if (fecha_seleccionada)
        this.solicitud.fecha = fecha_seleccionada
      this.solicitud.motivo = this.motivoSeleccionado;
      this.solicitud.empleado = JSON.parse(localStorage.getItem("usuario") || '{}');
      if (this.selected)
        this.solicitudService.findSolicitudByDateEmpleado(this.solicitud.fecha, this.solicitud.empleado.id)
          .subscribe(data => {
            if (data == false) {
              this.jornadaService.enviarSolicitud(this.solicitud).subscribe(() => {
                  this.motivoSeleccionado = "";
                  this.isSolicitado = false;
                  this._snackBar.open("La solicitud ha sido enviada correctamente", undefined, {duration: 2000})
                }
              );
            }else{
              this._snackBar.open("Ya existe una solicitud realizada para esta fecha", undefined, {duration: 2000})

            }
          })

      else
        this._snackBar.open("Debe seleccionar un día en el calendario", undefined, {duration: 2000})

    }

  }
}

@Component({
  selector: 'dialog-detalles-jornada',
  templateUrl: './dialog-detalles-jornada.html',
  styleUrls: ['./consultar-jornada.component.css']
})
export class DialogDetallesJornada {
  constructor(
    public dialogRef: MatDialogRef<DialogDetallesJornada>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private service: JornadaService,
    private trenService: TrenService
  ) {
  }

  nuevaIncidencia: string = "";


  addIncidencia() {
    //tarea puede ser undefined
    if (this.nuevaIncidencia != "" && this.data.tarea?.tren != undefined) {
      let incidencia = new Incidencia(this.nuevaIncidencia, this.data.tarea?.tren);
      this.trenService.addIncidencia(incidencia).subscribe()
      this.data.incidencias.push(incidencia);

    }
    // @ts-ignore
    document.getElementById("nuevasIncidencias").value = "";

  }

  cerrar() {
    this.data.final = undefined
    this.data.origen = undefined
    this.data.tarea = undefined
    this.data.incidencias = []
  }
}
