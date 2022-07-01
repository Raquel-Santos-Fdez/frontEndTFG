import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {BackendService} from "../../../servicios/backend.service";
import {StopTime} from "../../../model/stop_time/stop-time";
import {ProveedorService} from "../../../servicios/proveedor.service";

@Component({
  selector: 'app-tabla-horarios',
  templateUrl: './tabla-horarios.component.html',
  styleUrls: ['./tabla-horarios.component.css']
})
export class TablaHorariosComponent implements OnInit {

  stopTimes:StopTime[]=[];
  displayedColumns: string[] = ["horario"];

  constructor(private service:BackendService, private _route:ActivatedRoute, private proveedor:ProveedorService) {

  }

  ngOnInit(): void {
    let rutasConjuntas= this.proveedor.listRutas;
    let origen = this.proveedor.origen;
    let i;
    for(i=0; i<rutasConjuntas.length; i++){
      this.addStopTime(rutasConjuntas[i].route.route_id, origen.stop_id)
    }


  }

  async addStopTime(route_id: string, stop_id: string){
    let stopTimesAux:StopTime[]=[];
    await this.service.findTimeByRutaStop(route_id,stop_id).toPromise().then((response)=>
    {
      if(response)
        stopTimesAux=response;
    }).catch(e=> console.error(e))
    let i;
    for(i=0; i<stopTimesAux.length; i++)
      this.stopTimes.push(stopTimesAux[i])

  }


}
