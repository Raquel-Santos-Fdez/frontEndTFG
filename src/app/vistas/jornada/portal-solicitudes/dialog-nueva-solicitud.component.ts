import {Component, Inject, ViewChild} from "@angular/core";
import {MAT_DATE_FORMATS} from "@angular/material/core";
import {MotivoAusencia} from "../../../model/solicitud/solicitud";
import {SolicitudIntercambio} from "../../../model/solicitud/solicituIntercambio";
import {MatInput} from "@angular/material/input";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {JornadaService} from "../../../services/jornada.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SolicitudService} from "../../../services/solicitud.service";
import {Jornada} from "../../../model/jornada/jornada";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {DialogData} from "./portal-solicitudes.component";

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'dialog-nueva-solicitud',
  templateUrl: './dialog-nueva-solicitud.html',
  styleUrls: ['./portal-solicitudes.component.css'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]

})
export class DialogNuevaSolicitud {

  motivos: any[] = [];
  existeSolVar: boolean = false;
  errorFecha: boolean = false;

  selected: MotivoAusencia;
  solicitud: SolicitudIntercambio = new SolicitudIntercambio();

  @ViewChild('diaSolicitar', {
    read: MatInput
  }) fecha1: MatInput;

  @ViewChild('diaCubrir', {
    read: MatInput
  }) fecha2: MatInput;

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


  onNoClick(): void {
    this.dialogRef.close();
  }

  enviarSolicitud() {
    if (this.checkFecha()) {
      this.solicitud.empleado = JSON.parse(localStorage.getItem("usuario") || '{}');
      let formulario: any = document.getElementById("formulario");
      let formularioValido: boolean = formulario.reportValidity();
      this.solicitudService.existeSolicitud(this.solicitud.fecha, this.solicitud.empleado.id).subscribe(data => {
        let existe: boolean = false;
        existe = data;
        if (!existe) {
          if (formularioValido) {
            let jornada: Jornada;
            let jornada2: Jornada;
            if (this.solicitud.motivo != undefined && this.solicitud.fechaDescanso != undefined && this.solicitud.fecha != undefined) {
              //El empleado debe tener asignada una jornada de trabajo para la fecha seleccionada
              this.jornadaService.findJornadaByDateEmpleado(new Date(this.solicitud.fecha), this.solicitud.empleado.id).subscribe(data => {
                jornada = data[0];
                if (data.length != 0 && !jornada.diaLibre) {
                  //El empleado no deebe tener asignada ninguna jornada de trabajo para la fecha a cubrir
                  this.jornadaService.findJornadaByDateEmpleado(new Date(this.solicitud.fechaDescanso), this.solicitud.empleado.id).subscribe(data2 => {
                    jornada2 = data2[0]
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
        } else {
          this.existeSolVar = true;
        }

      })
    }


  }

  isPosterior(fecha: Date): boolean {
    let fecha_actual: Date = new Date();
    return (fecha_actual <= fecha);

  }

  saveDateLibrar(event: MatDatepickerInputEvent<Date>) {
    this.solicitud.fecha = new Date(`${event.value}`);
    this.existeSolVar = false;
    this.errorFecha = false;
  }

  saveDateCubrir(event: MatDatepickerInputEvent<Date>) {
    this.solicitud.fechaDescanso = new Date(`${event.value}`);
    this.existeSolVar = false;
    this.errorFecha = false;
  }

  checkFecha() {
    if (!this.isPosterior(this.solicitud.fecha)) {
      this.errorFecha = true;
      this.fecha1.value = "";
      this.fecha2.value = "";
      return false;
    }
    return true;
  }

  formatearMotivo(motivo:string) {
    if(motivo=="LICENCIA")
      return "Licencia";
    else if(motivo=="OTRO_MOTIVO")
      return "Otro motivo";
    else if(motivo=="FORMACION")
      return "Formación";
    else
      return "Visita médica";
  }
}
