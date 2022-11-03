import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {BackendService} from "../../../services/backend.service";
import {StopTime} from "../../../model/stop_time/stop-time";
import {ProveedorService} from "../../../services/proveedor.service";

@Component({
  selector: 'app-tabla-horarios',
  templateUrl: './tabla-horarios.component.html',
  styleUrls: ['./tabla-horarios.component.css']
})
export class TablaHorariosComponent implements OnInit {

  stopTimes:StopTime[]=[];
  displayedColumns: string[] = ["horario"];

  constructor(private service:BackendService, private proveedor:ProveedorService) {

  }

  ngOnInit(): void {
    let rutasConjuntas= this.proveedor.listRutas;
    let origen = this.proveedor.origen;
    let i;
    for(i=0; i<rutasConjuntas.length; i++){
      this.addStopTime(rutasConjuntas[i].ruta.ruta_id, origen.id)
    }


  }

   addStopTime(route_id: string, stop_id: string){

    this.service.findTimeByRutaStop(route_id, stop_id).subscribe(data=>
    {
      this.stopTimes=data
    })

  }


}
