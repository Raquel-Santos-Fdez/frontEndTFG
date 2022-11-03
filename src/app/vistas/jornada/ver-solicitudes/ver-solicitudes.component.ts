import {Component, Inject, OnInit} from '@angular/core';
import {Solicitud} from "../../../model/solicitud/solicitud";
import {SolicitudVacaciones} from "../../../model/solicitud/solicitudVacaciones";
import {DatePipe} from "@angular/common";
import {SolicitudService} from "../../../services/solicitud.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Empleado} from "../../../model/empleado/empleado";

@Component({
  selector: 'app-ver-solicitudes',
  templateUrl: './ver-solicitudes.component.html',
  styleUrls: ['./ver-solicitudes.component.css']
})
export class VerSolicitudesComponent implements OnInit {

  solicitudes: Solicitud[] = [];
  displayedColumns: string[] = ["fecha", "motivo", "empleado", "accion"];

  constructor(private solicitudService: SolicitudService, public dialog: MatDialog,) {

  }

  ngOnInit(): void {
    this.cargarSolicitudes();

  }

  cargarSolicitudes(){
    this.solicitudService.getAllSolicitudesPendientes().subscribe(data => {
      this.solicitudes = data;
    });
  }


  aceptarSolicitud(solicitud: Solicitud) {
    if (solicitud.type == "solicitudVacaciones") {
      this.solicitudService.findSolicitudesVacaciones(solicitud.empleado.id).subscribe(data => {
        this.dialog.open(DialogSolVacaciones, {
          disableClose: true,
          width: '450px',
          data: {
            solicitudes: data,
            verSolicitudComp: this,
            accion:"aceptar"
          }
        })
      })
    } else {
      this.solicitudService.aceptarSolicitud(solicitud).subscribe(() => {
        this.cargarSolicitudes()

      });
    }
  }

  borrarSolicitud(id: bigint) {
    let i;
    for (i = 0; i < this.solicitudes.length; i++)
      if (this.solicitudes[i].id == id)
        this.solicitudes.splice(i, 1);
  }

  rechazarSolicitud(solicitud:Solicitud) {
    if (solicitud.type == "solicitudVacaciones") {
      this.solicitudService.findSolicitudesVacaciones(solicitud.empleado.id).subscribe(data => {
        this.dialog.open(DialogSolVacaciones, {
          disableClose: true,
          width: '450px',
          data: {
            solicitudes: data,
            verSolicitudComp: this,
            accion:"rechazar"
          }
        })
      })
    } else {
      this.solicitudService.rechazarSolicitud(solicitud.id).subscribe(() => this.borrarSolicitud(solicitud.id));
    }

  }

  getFinVacaciones(solicitud: Solicitud) {
    if (solicitud.type == "solicitudVacaciones") {
      let pipe = new DatePipe('en-US')
      let fecha = pipe.transform((solicitud as SolicitudVacaciones).fechaFinVacaciones, 'yyyy-MM-dd')
      return " - " + fecha;
    }
    return "";
  }
}


export interface DialogData {
  solicitudes: SolicitudVacaciones[],
  verSolicitudComp: VerSolicitudesComponent,
  accion: String
}

@Component({
  selector: 'vacaciones-dialog',
  templateUrl: './vacaciones-dialog.html',
  styleUrls: ['./ver-solicitudes.component.css']
})
export class DialogSolVacaciones {

  periodo1: String;
  periodo2: String;
  empleado: Empleado;

  constructor(
    public dialogRef: MatDialogRef<DialogSolVacaciones>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private  solicitudService: SolicitudService
  ) {
    this.periodo1 = this.data.solicitudes[0].fecha + " - " + this.data.verSolicitudComp.getFinVacaciones(this.data.solicitudes[0])
    this.periodo2 = this.data.solicitudes[1].fecha + " - " + this.data.verSolicitudComp.getFinVacaciones(this.data.solicitudes[1])
    this.empleado = this.data.solicitudes[0].empleado;
  }

  aceptarVacaciones() {
    this.data.solicitudes.forEach(s => {
      this.solicitudService.aceptarSolicitud(s).subscribe(() => {
        this.data.verSolicitudComp.borrarSolicitud(s.id);
        this.dialogRef.close();
      });
    })
  }

  rechazarVacaciones() {
    this.data.solicitudes.forEach(s => {
      this.solicitudService.rechazarSolicitud(s.id).subscribe(() => {
        this.data.verSolicitudComp.borrarSolicitud(s.id);
        this.dialogRef.close();
      });
    })
  }
}
