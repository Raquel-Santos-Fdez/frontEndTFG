import { Component, OnInit } from '@angular/core';
import {JornadaService} from "../../../servicios/jornada.service";
import {Solicitud} from "../../../model/solicitud/solicitud";
import {SolicitudVacaciones} from "../../../model/solicitud/solicitudVacaciones";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-ver-solicitudes',
  templateUrl: './ver-solicitudes.component.html',
  styleUrls: ['./ver-solicitudes.component.css']
})
export class VerSolicitudesComponent implements OnInit {

  solicitudes:Solicitud[]=[];

  constructor(private service:JornadaService) {

  }

  ngOnInit(): void {
    this.service.getAllSolicitudesPendientes().subscribe(data => {
      this.solicitudes=data;
    });
  }


  aceptarSolicitud(solicitud:Solicitud) {
    this.service.aceptarSolicitud(solicitud).subscribe(()=> {
      this.borrarSolicitud(solicitud.id);
      // this.service.gestionarSolicitudAceptada(solicitud).subscribe();
    });


  }

  borrarSolicitud(id:bigint){
    let i;
    for(i=0;i<this.solicitudes.length;i++)
      if(this.solicitudes[i].id==id)
        this.solicitudes.splice(i,1);
  }

  rechazarSolicitud(id:bigint) {
    this.service.rechazarSolicitud(id).subscribe(()=>this.borrarSolicitud(id) );
  }

  getFinVacaciones(solicitud:Solicitud) {
    if(solicitud.type=="solicitudVacaciones") {
      let pipe = new DatePipe('en-US')
      let fecha = pipe.transform((solicitud as SolicitudVacaciones).fechaFinVacaciones, 'yyyy-MM-dd')
      return " - " + fecha;
    }
    return "";
  }
}
