import {Component, OnInit} from '@angular/core';
import {JornadaService} from "../../../servicios/jornada.service";
import { Solicitud} from "../../../model/solicitud/solicitud";
import {MatSnackBar} from '@angular/material/snack-bar';
import {DatePipe} from "@angular/common";
import {SolicitudVacaciones} from "../../../model/solicitud/solicitudVacaciones";


export interface PeriodoVacaciones {
  invierno: string;
  verano: string;
}

const ELEMENT_DATA: PeriodoVacaciones[] = [
  {invierno: '21/12/2022 - 09/01/2023', verano: '01/06/2022 - 15/06/2022'},
  {invierno: '01/10/2022 - 20/10/2022', verano: '01/07/2022 - 15/07/2022'},
  {invierno: '01/12/2022 - 20/12/2022', verano: '16/06/2022 - 30/06/2022'},
  {invierno: '21/10/2022 - 08/11/2022', verano: '16/07/2022 - 31/07/2022'},
  {invierno: '01/09/2022 - 15/09/2022', verano: '12/05/2022 - 31/05/2022'},
  {invierno: '01/08/2022 - 15/08/2022', verano: '12/03/2022 - 31/03/2022'},
  {invierno: '16/09/2022 - 30/09/2022', verano: '02/04/2022 - 21/04/2022'},
  {invierno: '16/08/2022 - 31/08/2022', verano: '23/04/2022 - 11/05/2022'},

];

@Component({
  selector: 'app-solicitar-vacaciones',
  templateUrl: './solicitar-vacaciones.component.html',
  styleUrls: ['./solicitar-vacaciones.component.css']
})
export class SolicitarVacacionesComponent implements OnInit {

  solicitud: SolicitudVacaciones = new SolicitudVacaciones();
  selected: string;
  displayedColumns: string[] = ['invierno', 'verano'];
  dataSource = ELEMENT_DATA;
  periodoSeleccionado: PeriodoVacaciones;

  constructor(private service: JornadaService, private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  enviarSolicitud() {

    this.solicitud.motivo = "Vacaciones";
    this.solicitud.empleado = JSON.parse(localStorage.getItem("usuario") || '{}');

    this.solicitarPeriodo(this.periodoSeleccionado.invierno);

    setTimeout(()=>this.solicitarPeriodo(this.periodoSeleccionado.verano),500);
  }

  private solicitarPeriodo(periodo: string) {
    let vacacionesString = periodo.split(' - ');

    let i;
    let vacacionesDate: Date[] = [];
    let pipe = new DatePipe('en-US')

    for (i = 0; i < vacacionesString.length; i++) {
      let [dia, mes, year] = vacacionesString[i].split('/')
      vacacionesDate.push(new Date(+year, +mes - 1, +dia))
    }

    this.solicitud.fechaFinVacaciones=vacacionesString[1];

    let fecha_seleccionada = pipe.transform(vacacionesDate[0], 'yyyy-MM-dd')
    if (fecha_seleccionada) {

      //comprobamos que no existe ya una solicitud para esa fecha y ese empleado
      this.service.findSolicitudByFechaEmpleado(fecha_seleccionada, this.solicitud.empleado.id).subscribe(data => {
        if (fecha_seleccionada)
          this.solicitud.fecha = fecha_seleccionada
        if ((data as Solicitud[]).length == 0) {
          this.service.solicitarVacaciones(this.solicitud).subscribe(() => {
              this._snackBar.open("La solicitud ha sido enviada correctamente", undefined, {duration: 2000})
          });
        } else {
          this._snackBar.open("Ya existe una solicitud para esta fecha", undefined, {duration: 2000})
        }
      })
    }
  }

}
