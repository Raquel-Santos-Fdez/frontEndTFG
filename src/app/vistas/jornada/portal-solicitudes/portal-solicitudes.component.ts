import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {JornadaService} from "../../../servicios/jornada.service";
import {SolicitudIntercambio} from "../../../model/solicitud/solicituIntercambio";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {DatePipe} from "@angular/common";
import {Empleado} from "../../../model/empleado/empleado";
import {Solicitud} from "../../../model/solicitud/solicitud";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Jornada} from "../../../model/jornada/jornada";
import {SolicitudService} from "../../../servicios/solicitud.service";

export interface DialogData {
  portalSolicitudes: PortalSolicitudesComponent
}


@Component({
  selector: 'app-portal-solicitudes',
  templateUrl: './portal-solicitudes.component.html',
  styleUrls: ['./portal-solicitudes.component.css']
})
export class PortalSolicitudesComponent implements OnInit {

  colummsTodasSolicitudes: string[] = ["fechaTrabajo", "fechaDescanso", "empleado","aceptar"];
  columnsMisSolicitudes: string[] = ["fechaTrabajo", "fechaDescanso", "estado"];
  columnsVacaciones: string[] = ["periodoInvierno", "estado"];
  misSolicitudes: Solicitud[];
  solicitudesIntercambio: Solicitud[] = [];
  solicitudesVacaciones: Solicitud[] = [];
  empleado: Empleado;
  isReady: boolean = false;


  constructor(public dialog: MatDialog, private jornadaService: JornadaService, private solicitudService:SolicitudService) {
    this.empleado = JSON.parse(localStorage.getItem("usuario") || '{}');

  }

  ngOnInit(): void {
    this.cargarSolicitudes();
    this.cargarMisSolicitudes();
    this.cargarSolicitudesVacaciones()
  }

  openDialog(): void {
    this.dialog.open(DialogNuevaSolicitud, {
      width: '500px',
      data: {portalSolicitudes: this}
    });
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
    this.jornadaService.reasignar(solicitud).subscribe(() =>
      this.cargarSolicitudes()
    );
  }

  getFinVacaciones(fechaFinVacaciones: any) {
    let pipe = new DatePipe('en-US')
    let fecha_seleccionada = pipe.transform(new Date(fechaFinVacaciones), 'yyyy-MM-dd')
    if (fecha_seleccionada)
      return fecha_seleccionada

    return "";
  }
}

@Component({
  selector: 'dialog-nueva-solicitud',
  templateUrl: './dialog-nueva-solicitud.html',
  styleUrls: ['./portal-solicitudes.component.css']
})
export class DialogNuevaSolicitud {

  constructor(
    public dialogRef: MatDialogRef<DialogNuevaSolicitud>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private jornadaService: JornadaService,
    private _snackBar: MatSnackBar,
  ) {
  }

  selected: string;
  solicitud: SolicitudIntercambio = new SolicitudIntercambio();

  onNoClick(): void {
    this.dialogRef.close();
  }

  enviarSolicitud() {

    let formulario: any = document.getElementById("formulario");
    let formularioValido: boolean = formulario.reportValidity();
    if (formularioValido) {
      this.solicitud.motivo = this.selected;
      this.solicitud.empleado = JSON.parse(localStorage.getItem("usuario") || '{}');
      let jornada: Jornada;
      if (this.solicitud.motivo != undefined && this.solicitud.fechaDescanso != undefined && this.solicitud.fecha != undefined) {
        //El empleado debe tener asignada una jornada de trabajo para la fecha seleccionada
        this.jornadaService.findJornadaByDateEmpleado(new Date(this.solicitud.fecha), this.solicitud.empleado.id).subscribe(data => {
          jornada = data[0];
          if (data.length != 0 && !jornada.diaLibre) {
            //El empleado no deebe tener asignada ninguna jornada de trabajo para la fecha a cubrir
            this.jornadaService.findJornadaByDateEmpleado(new Date(this.solicitud.fechaDescanso), this.solicitud.empleado.id).subscribe(data => {
              if (data.length == 0 || jornada.diaLibre)
                this.jornadaService.addSolicitudIntercambio(this.solicitud).subscribe(() => {
                  this.data.portalSolicitudes.cargarMisSolicitudes()
                  this.dialogRef.close();
                });
              else
                this._snackBar.open("Debe seleccionar un día a cubrir sin jornada asignada", undefined, {duration: 2000})
            });
          } else
            this._snackBar.open("Debe seleccionar una intercambio para un día con una jornada asignada", undefined, {duration: 2000})
        })

      }
    }

  }

  saveDateLibrar(event: MatDatepickerInputEvent<Date>) {

    let pipe = new DatePipe('en-US')
    let fecha_seleccionada = pipe.transform(new Date(`${event.value}`), 'yyyy-MM-dd')
    if (fecha_seleccionada)
      this.solicitud.fecha = fecha_seleccionada

  }

  saveDateCubrir(event: MatDatepickerInputEvent<Date>) {
    let pipe = new DatePipe('en-US')
    let fecha_seleccionada = pipe.transform(new Date(`${event.value}`), 'yyyy-MM-dd')
    if (fecha_seleccionada)
      this.solicitud.fechaDescanso = fecha_seleccionada
  }
}
