import { Component, OnInit } from '@angular/core';
import {JornadaService} from "../../../servicios/jornada.service";
import {Solicitud} from "../../../model/solicitud/solicitud";

@Component({
  selector: 'app-ver-solicitudes',
  templateUrl: './ver-solicitudes.component.html',
  styleUrls: ['./ver-solicitudes.component.css']
})
export class VerSolicitudesComponent implements OnInit {

  solicitudes:Solicitud[]=[];

  constructor(private service:JornadaService) { }

  ngOnInit(): void {

    this.service.getAllSolicitudesPendientes().subscribe(data => {
      this.solicitudes=data;
    });
  }


  aceptarSolicitud(id:bigint) {
    this.service.aceptarSolicitud(id).subscribe();
    this.borrarSolicitud(id);
  }

  borrarSolicitud(id:bigint){
    let i;
    for(i=0;i<this.solicitudes.length;i++)
      if(this.solicitudes[i].id==id)
        this.solicitudes.splice(i,1);
  }

  rechazarSolicitud(id:bigint) {
    this.service.rechazarSolicitud(id).subscribe();
    this.borrarSolicitud(id);
  }
}
