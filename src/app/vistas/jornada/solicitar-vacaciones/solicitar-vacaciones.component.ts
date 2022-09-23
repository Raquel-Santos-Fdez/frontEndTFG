import {Component, OnInit} from '@angular/core';
import {JornadaService} from "../../../servicios/jornada.service";
import {EstadoEnum, Solicitud} from "../../../model/solicitud/solicitud";
import {MatSnackBar} from '@angular/material/snack-bar';
import {SolicitudSimple} from "../../../model/solicitud/solicitudSimple";
import {DatePipe} from "@angular/common";


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

  solicitud: SolicitudSimple = new SolicitudSimple();
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
    this.solicitarPeriodo(this.periodoSeleccionado.verano);

  }


  // console.log(this.periodoSeleccionado.invierno.split('-'))

  // this.solicitud.motivo=this.selected;
  // this.solicitud.empleado=JSON.parse(localStorage.getItem("usuario")||'{}');
  //
  //
  // if(this.solicitud.fecha!=undefined && this.solicitud.motivo!=undefined) {
  //   //si el empleado no tiene una jornada asignada ese dia mostrar un aviso
  //   this.service.findJornadaByDateEmpleado(new Date(this.solicitud.fecha), this.solicitud.empleado.id).subscribe(data=>{
  //     if(data)
  //       this.service.enviarSolicitud(this.solicitud).subscribe(()=>
  //         this._snackBar.open("La solicitud ha sido enviada correctamente", undefined, {duration: 2000})
  //       );
  //     else
  //       this._snackBar.open("No tiene una jornada asignada para el día seleccionado. Inténtelo de nuevo", undefined, {duration: 2000})
  //   })
  //
  //
  // }

  // saveDate(event: MatDatepickerInputEvent<Date>) {
  //   this.solicitud.fecha=new Date(`${event.value}`).toISOString().split('T')[0];
  // }

  private solicitarPeriodo(periodo: string) {
    let veranoString = periodo.split(' - ');

    let i;
    let veranoDate: Date[] = [];
    let j;
    let pipe = new DatePipe('en-US')
    const UN_DIA_EN_MILISEGUNDOS = 1000 * 60 * 60 * 24;

    for (i = 0; i < veranoString.length; i++) {
      let [dia, mes, year] = veranoString[i].split('/')
      veranoDate.push(new Date(+year, +mes - 1, +dia))

      for (j = veranoDate[0]; j <= veranoDate[i]; j = new Date(j.getTime() + UN_DIA_EN_MILISEGUNDOS)) {

        let fecha_seleccionada = pipe.transform(j, 'yyyy-MM-dd')
        if (fecha_seleccionada) {

          //comprobamos que no existe ya una solicitud para esa fecha y ese empleado
          this.service.findSolicitudByFechaEmpleado(fecha_seleccionada, this.solicitud.empleado.id).subscribe(data => {
            if (fecha_seleccionada)
              this.solicitud.fecha = fecha_seleccionada
            if ((data as Solicitud[]).length == 0) {
              this.service.enviarSolicitud(this.solicitud).subscribe(() =>
                this._snackBar.open("La solicitud ha sido enviada correctamente", undefined, {duration: 2000})
              );
            } else {
              this._snackBar.open("Ya existe una solicitud para esta fecha", undefined, {duration: 2000})
            }
          })
        }
      }
    }
  }
}
