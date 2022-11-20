import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {JornadaService} from "../../../services/jornada.service";
import {SolicitudIntercambio} from "../../../model/solicitud/solicituIntercambio";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {DatePipe} from "@angular/common";
import {Empleado} from "../../../model/empleado/empleado";
import {MotivoAusencia, Solicitud} from "../../../model/solicitud/solicitud";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Jornada} from "../../../model/jornada/jornada";
import {SolicitudService} from "../../../services/solicitud.service";
import {DetallesJornadaIntercambioComponent} from "./detalles-jornada-intercambio.component";
import {MatInput} from "@angular/material/input";
import {MAT_DATE_FORMATS} from "@angular/material/core";
import {DialogNuevaSolicitud} from "./dialog-nueva-solicitud.component";

export interface DialogData {
  portalSolicitudes: PortalSolicitudesComponent
}

@Component({
  selector: 'app-portal-solicitudes',
  templateUrl: './portal-solicitudes.component.html',
  styleUrls: ['./portal-solicitudes.component.css']
})
export class PortalSolicitudesComponent implements OnInit {

  colummsTodasSolicitudes: string[] = ["fechaTrabajo", "fechaDescanso", "empleado", "accion"];
  columnsMisSolicitudes: string[] = ["fechaTrabajo", "fechaDescanso", "estado"];
  columnsVacaciones: string[] = ["periodoInvierno", "estado"];
  misSolicitudes: Solicitud[];
  solicitudesIntercambio: Solicitud[] = [];
  solicitudesVacaciones: Solicitud[] = [];
  empleado: Empleado;
  isReady: boolean = false;


  constructor(public dialog: MatDialog,
              private jornadaService: JornadaService,
              private solicitudService: SolicitudService,
              private _snackBar: MatSnackBar) {
    this.empleado = JSON.parse(localStorage.getItem("usuario") || '{}');

  }

  ngOnInit(): void {
    this.cargarSolicitudes();
    this.cargarMisSolicitudes();
    this.cargarSolicitudesVacaciones()
  }

  nuevaSolicitud(): void {
    if (this.empleado.nDiasLibres > 0) {
      this.dialog.open(DialogNuevaSolicitud, {
        width: '500px',
        data: {portalSolicitudes: this}
      });
    } else {
      this._snackBar.open("Ha alcanzado el máximo de días libres posibles", undefined, {duration: 2000})
    }
  }

  private cargarSolicitudes() {
    this.solicitudService.findNotOwnSolicitudes(this.empleado).subscribe(data => {
      this.solicitudesIntercambio = data;
    });
  }

  public cargarMisSolicitudes() {
    this.solicitudService.findOwnSolicitudes(this.empleado.id).subscribe(data => {
      this.misSolicitudes = data;
    });
  }

  public cargarSolicitudesVacaciones() {
    this.solicitudService.findSolicitudesVacaciones(this.empleado.id).subscribe(data => {
      this.solicitudesVacaciones = data;
    })
  }

  aceptarSolicitud(solicitud: SolicitudIntercambio) {
    solicitud.nuevoEmpleado = this.empleado;
    this.jornadaService.reasignar(solicitud).subscribe(() => {
        this.cargarSolicitudes()
        this._snackBar.open("La solicitud ha sido aceptada", undefined, {duration: 2000})
      }
    );
  }

  formatearFecha(fechaFinVacaciones: Date) {
    if (fechaFinVacaciones) {
      let pipe = new DatePipe('es-ES')
      let fecha_seleccionada = pipe.transform(fechaFinVacaciones, 'dd-MM-yyyy')
      if (fecha_seleccionada)
        return fecha_seleccionada
    }

    return "";
  }

  verDetallesJornada(solicitud: SolicitudIntercambio) {
    let jornada: Jornada;
    this.jornadaService.findJornadaByDateEmpleado(new Date(solicitud.fecha), solicitud.empleado.id).subscribe(data => {
      jornada = data[0];
      this.dialog.open(DetallesJornadaIntercambioComponent, {
        width: '450px',
        data: {
          tareas: jornada.tareas
        }
      })
    });
  }
}
