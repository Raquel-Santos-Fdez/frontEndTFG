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

export interface DialogData {
  portalSolicitudes: PortalSolicitudesComponent
}


@Component({
  selector: 'app-portal-solicitudes',
  templateUrl: './portal-solicitudes.component.html',
  styleUrls: ['./portal-solicitudes.component.css']
})
export class PortalSolicitudesComponent implements OnInit {

  colummsTodasSolicitudes: string[] = ["fechaTrabajo", "fechaDescanso", "aceptar"];
  columnsMisSolicitudes: string[] = ["fechaTrabajo", "fechaDescanso", "estado"];
  columnsVacaciones: string[] = ["periodoInvierno", "estado"];
  misSolicitudes: Solicitud[];
  solicitudesIntercambio: Solicitud[] = [];
  solicitudesVacaciones:Solicitud[]=[];
  empleado: Empleado;
  isReady: boolean = false;


  constructor(public dialog: MatDialog, private service: JornadaService) {
    this.empleado = JSON.parse(localStorage.getItem("usuario") || '{}');

  }

  ngOnInit(): void {
    this.cargarSolicitudes();
    this.cargarMisSolicitudes();
    this.cargarSolicitudesVacaciones()
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogNuevaSolicitud, {
      width: '500px',
      data: {portalSolicitudes: this}
    });
  }

  private cargarSolicitudes() {
    this.service.findNotOwnSolicitudes(this.empleado.id).subscribe(data => {
      this.solicitudesIntercambio = data;
    });
  }

  public cargarMisSolicitudes() {
    this.service.findOwnSolicitudes(this.empleado.id).subscribe(data => {
      this.misSolicitudes = data;
    });
  }

  public cargarSolicitudesVacaciones(){
    this.service.findSolicitudesVacaciones(this.empleado.id).subscribe(data=>{
      this.solicitudesVacaciones=data;
    })
  }

  aceptarSolicitud(solicitud: SolicitudIntercambio) {
    solicitud.nuevoEmpleado = this.empleado;
    this.service.reasignar(solicitud).subscribe(() =>
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
    private service: JornadaService,
    private _snackBar: MatSnackBar,
  ) {
  }

  selected: string;
  solicitud: SolicitudIntercambio = new SolicitudIntercambio();

  onNoClick(): void {
    this.dialogRef.close();
  }

  enviar() {
    this.solicitud.motivo = this.selected;
    this.solicitud.empleado = JSON.parse(localStorage.getItem("usuario") || '{}');
    let jornada: Jornada;
    if (this.solicitud.motivo != undefined && this.solicitud.fechaDescanso != undefined && this.solicitud.fecha != undefined) {
      //El empleado debe tener asignada una jornada de trabajo para la fecha seleccionada
      this.service.findJornadaByDateEmpleado(new Date(this.solicitud.fecha), this.solicitud.empleado.id).subscribe(data => {
        jornada = data[0];
        if (data.length != 0 && !jornada.isDiaLibre) {
          //El empleado no deebe tener asignada ninguna jornada de trabajo para la fecha a cubrir
          this.service.findJornadaByDateEmpleado(new Date(this.solicitud.fechaDescanso), this.solicitud.empleado.id).subscribe(data => {
            if (data.length == 0 || jornada.isDiaLibre)
              this.service.addSolicitudIntercambio(this.solicitud).subscribe(() => {
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
