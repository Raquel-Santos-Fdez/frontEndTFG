import { Component, OnInit } from '@angular/core';
import {JornadaService} from "../../../servicios/jornada.service";
import {Solicitud} from "../../../model/solicitud/solicitud";
import {SolicitudIntercambio} from "../../../model/solicitud/solicituIntercambio";
import {SolicitudSimple} from "../../../model/solicitud/solicitudSimple";

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
      // this.solicitudes[0]=data[0]
      // let sol=new Solicitud()
      console.log( this.solicitudes[0])
      // console.log(typeof this.solicitudes.values()Array.prototype.forEach()dexOf(this.solicitudes,0))
      console.log(typeof this.solicitudes[0])
    });


  }


  aceptarSolicitud(solicitud:Solicitud) {
    this.service.aceptarSolicitud(solicitud).subscribe(()=> {
      this.borrarSolicitud(solicitud.id);
      this.service.gestionarSolicitudAceptada(solicitud).subscribe();
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
}
