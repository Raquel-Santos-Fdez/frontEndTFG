import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Solicitud} from "../../../model/solicitud/solicitud";
import {SolicitudVacaciones} from "../../../model/solicitud/solicitudVacaciones";
import {DatePipe} from "@angular/common";
import {SolicitudService} from "../../../services/solicitud.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Empleado} from "../../../model/empleado/empleado";
import {DetallesEmpleadoComponent} from "../detalles-empleado.component";
import {JornadaService} from "../../../services/jornada.service";
import {Jornada} from "../../../model/jornada/jornada";
import {Tarea} from "../../../model/tarea/tarea";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {tap} from "rxjs";

@Component({
  selector: 'app-ver-solicitudes',
  templateUrl: './ver-solicitudes.component.html',
  styleUrls: ['./ver-solicitudes.component.css']
})
export class VerSolicitudesComponent implements OnInit{

  solicitudes: Solicitud[] = [];
  displayedColumns: string[] = ["fecha", "motivo", "empleado", "accion"];
  diaSeleccionado: Date | null = null;

  jornadasEmpleado: Jornada[] = [];
  tareas: { jornada: Jornada, tarea: Tarea }[] = [];
  hasTarea:boolean=false;
  columnasJornadas:string[]=["fecha", "empleado"];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource:MatTableDataSource<Solicitud>;

  constructor(private solicitudService: SolicitudService, public dialog: MatDialog,
              private jornadaService: JornadaService) {

  }

  ngOnInit(): void {
    this.cargarSolicitudes();

  }

  cargarSolicitudes() {
    this.solicitudService.getAllSolicitudesPendientes().subscribe(data => {
      this.solicitudes = data;
      this.paginarSolicitudes(this.solicitudes)
    });
  }

  paginarSolicitudes(solicitudes:Solicitud[]){
    this.dataSource=new MatTableDataSource(solicitudes)
    this.dataSource.paginator=this.paginator;
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

  rechazarSolicitud(solicitud:Solicitud) {
    if (solicitud.type == "solicitudVacaciones") {
      console.log(solicitud.id)
      this.solicitudService.findSolicitudesVacacionesPendientes(solicitud.empleado.id).subscribe(data => {
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
      this.solicitudService.rechazarSolicitud(solicitud.id).subscribe(() => this.cargarSolicitudes());
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

  verDetallesEmpleado(empleado:Empleado) {
    this.dialog.open(DetallesEmpleadoComponent, {
      width: '450px',
      data: {
        empleado: empleado
      }
    })
  }

  seleccionarDia() {
    this.hasTarea=false;
    if (this.diaSeleccionado) {
      this.jornadaService.findJornadaByDate(this.diaSeleccionado).subscribe(data => {
        this.jornadasEmpleado = data;
        if(this.jornadasEmpleado.length>0)
          this.hasTarea=true;
      });
    }
  }

  formatearFecha(date: string) {
    let pipe = new DatePipe('en-US')
    let fecha = pipe.transform(date, 'yyyy-MM-dd')
    if (fecha)
      return fecha;
    return ""

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
        this.data.verSolicitudComp.cargarSolicitudes();
        this.dialogRef.close();
      });
    })
  }

  rechazarVacaciones() {
    this.data.solicitudes.forEach(s => {
      this.solicitudService.rechazarSolicitud(s.id).subscribe(() => {
        this.data.verSolicitudComp.cargarSolicitudes();
        this.dialogRef.close();
      });
    })
  }
}
