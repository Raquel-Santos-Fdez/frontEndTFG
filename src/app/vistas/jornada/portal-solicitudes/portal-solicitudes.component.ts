import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {JornadaService} from "../../../servicios/jornada.service";
import {SolicitudIntercambio} from "../../../model/solicitud/solicituIntercambio";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {DatePipe} from "@angular/common";
import {Empleado} from "../../../model/empleado/empleado";
import {Solicitud} from "../../../model/solicitud/solicitud";

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
  todasSolicitudes: SolicitudIntercambio[] = [];
  misSolicitudes: Solicitud[]
  empleado: Empleado;
  solicitudesIntercambio: SolicitudIntercambio[]=[];

  constructor(public dialog: MatDialog, private service: JornadaService) {
    this.empleado = JSON.parse(localStorage.getItem("usuario") || '{}');
    this.cargarSolicitudes();
    console.log(this.solicitudesIntercambio)
  }

  ngOnInit(): void {


    this.cargarMisSolicitudes();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogNuevaSolicitud, {
      width: '500px',
      data: {portalSolicitudes: this}
    });
  }

  private  cargarSolicitudes(){
    this.service.findNotOwnSolicitudes(this.empleado.id).subscribe(data => {
      this.todasSolicitudes = data;
      //fecha debe descansar y fechaDescanso debe trabajar
      this.todasSolicitudes.forEach(s => {
        this.service.findJornadaByDateEmpleado(new Date(s.fechaDescanso), this.empleado.id).subscribe(data => {
          if (data.length != 0) {
            this.service.findJornadaByDateEmpleado(new Date(s.fecha), this.empleado.id).subscribe(data2 => {
              if (data2.length == 0)
                this.solicitudesIntercambio.push(s)
            })
          }
        })
      })
    });
  }

  public cargarMisSolicitudes() {
    this.service.findOwnSolicitudes(this.empleado.id).subscribe(data => {
      this.misSolicitudes = data;
    });
  }

  aceptarSolicitud(solicitud: SolicitudIntercambio) {
    let id: bigint = BigInt("1");
    let posible = setTimeout(() => {
      this.service.checkCambioJornada(id, solicitud.fecha, solicitud.fechaDescanso)
    }, 500);
    if (!posible)
      alert("No es posible realizar el cambio de turno, por favor consulta tu jornada")
    else {
      this.service.reasignar(solicitud).subscribe();
      this.todasSolicitudes = this.todasSolicitudes.filter(s => s != solicitud)
    }


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
  ) {
  }

  selected: string;
  solicitud: SolicitudIntercambio = new SolicitudIntercambio()

  onNoClick(): void {
    this.dialogRef.close();
  }

  enviar() {
    this.solicitud.motivo = this.selected;
    this.solicitud.empleado = JSON.parse(localStorage.getItem("usuario") || '{}');
    if (this.solicitud.motivo != undefined && this.solicitud.fechaDescanso != undefined && this.solicitud.fecha != undefined) {
      //COMPROBAR --> Si el empleado no tiene una jornada para el dia seleccionado de descanso mostrar aviso
      this.service.findJornadaByDateEmpleado(new Date(this.solicitud.fecha), this.solicitud.empleado.id).subscribe(data => {
        if (data)
          this.service.addSolicitudIntercambio(this.solicitud).subscribe(() => this.data.portalSolicitudes.cargarMisSolicitudes());
      })

    }
    this.dialogRef.close();
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
