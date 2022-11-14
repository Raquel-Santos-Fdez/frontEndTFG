import {Component, Inject, OnInit} from '@angular/core';
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


  constructor(public dialog: MatDialog,
              private jornadaService: JornadaService,
              private solicitudService:SolicitudService,
              private _snackBar: MatSnackBar) {
    this.empleado = JSON.parse(localStorage.getItem("usuario") || '{}');

  }

  ngOnInit(): void {
    this.cargarSolicitudes();
    this.cargarMisSolicitudes();
    this.cargarSolicitudesVacaciones()
  }

  nuevaSolicitud(): void {
    if(this.empleado.nDiasLibres>0) {
      this.dialog.open(DialogNuevaSolicitud, {
        width: '500px',
        data: {portalSolicitudes: this}
      });
    }else{
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

  motivos:any[]=[];
  existeSolVar:boolean=false;

  constructor(
    public dialogRef: MatDialogRef<DialogNuevaSolicitud>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private jornadaService: JornadaService,
    private _snackBar: MatSnackBar,
    private solicitudService: SolicitudService,
  ) {
    for (let item in MotivoAusencia) {
      if (isNaN(Number(item))) {
        if (MotivoAusencia[item] != MotivoAusencia.VACACIONES.toString())
          this.motivos.push({text: item, value: MotivoAusencia[item]})
      }
    }
  }

  selected: MotivoAusencia;
  solicitud: SolicitudIntercambio = new SolicitudIntercambio();

  onNoClick(): void {
    this.dialogRef.close();
  }

  enviarSolicitud() {
    this.solicitud.empleado = JSON.parse(localStorage.getItem("usuario") || '{}');
    let formulario: any = document.getElementById("formulario");
    let formularioValido: boolean = formulario.reportValidity();
    this.solicitudService.existeSolicitud(this.solicitud.fecha, this.solicitud.empleado.id).subscribe(data=>{
      let existe:boolean=false;
      existe=data;
      if(!existe){
        if (formularioValido) {
          // this.solicitud.motivo = this.selected;

          let jornada: Jornada;
          let jornada2:Jornada;
          if (this.solicitud.motivo != undefined && this.solicitud.fechaDescanso != undefined && this.solicitud.fecha != undefined) {
            //El empleado debe tener asignada una jornada de trabajo para la fecha seleccionada
            this.jornadaService.findJornadaByDateEmpleado(new Date(this.solicitud.fecha), this.solicitud.empleado.id).subscribe(data => {
              jornada = data[0];
              if (data.length != 0 && !jornada.diaLibre) {
                //El empleado no deebe tener asignada ninguna jornada de trabajo para la fecha a cubrir
                this.jornadaService.findJornadaByDateEmpleado(new Date(this.solicitud.fechaDescanso), this.solicitud.empleado.id).subscribe(data2 => {
                  jornada2=data2[0]
                  if (data2.length == 0 || jornada2.diaLibre)
                    this.jornadaService.addSolicitudIntercambio(this.solicitud).subscribe(() => {
                      this.data.portalSolicitudes.cargarMisSolicitudes()
                      this._snackBar.open("La solicitud ha sido añadida correctamente", undefined, {duration: 2000})
                      this.dialogRef.close();
                    });
                  else
                    this._snackBar.open("Debe seleccionar un día a cubrir sin jornada asignada", undefined, {duration: 2000})
                });
              } else
                this._snackBar.open("Debe seleccionar un intercambio para un día con una jornada asignada", undefined, {duration: 2000})
            })

          }
        }
      }
      else{
        this.existeSolVar=true;
      }

    })


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
