import { Component, OnInit } from '@angular/core';
import {JornadaService} from "../../../servicios/jornada.service";
import {Solicitud} from "../../../model/solicitud/solicitud";
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SolicitudSimple} from "../../../model/solicitud/solicitudSimple";

@Component({
  selector: 'app-solicitar-vacaciones',
  templateUrl: './solicitar-vacaciones.component.html',
  styleUrls: ['./solicitar-vacaciones.component.css']
})
export class SolicitarVacacionesComponent implements OnInit {

  solicitud:Solicitud=new SolicitudSimple();
  selected: string;

  constructor(private service:JornadaService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  enviarSolicitud() {
    this.solicitud.motivo=this.selected;

    if(this.solicitud.fecha!=undefined && this.solicitud.motivo!=undefined) {
      this.service.enviarSolicitud(this.solicitud).subscribe();
      this._snackBar.open("La solicitud ha sido enviada correctamente", undefined, {duration: 2000});
    }

  }

  saveDate(event: MatDatepickerInputEvent<Date>) {
    this.solicitud.fecha=new Date(`${event.value}`).toISOString().split('T')[0];
  }
}
