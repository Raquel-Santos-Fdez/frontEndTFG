import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {BackendService} from "../../../servicios/backend.service";
import {StopTime} from "../../../model/stop_time/stop-time";
import {Route} from "../../../model/route/route";

@Component({
  selector: 'app-tabla-horarios',
  templateUrl: './tabla-horarios.component.html',
  styleUrls: ['./tabla-horarios.component.css']
})
export class TablaHorariosComponent implements OnInit {

  stopTimes:StopTime[];

  constructor(private service:BackendService, private _route:ActivatedRoute) {

  }

  ngOnInit(): void {
    let id= this._route.snapshot.paramMap.get('id');

    let ruta:Route;
    let nombreRuta="";

    if(id!=null) {
      this.service.findRouteById(id).subscribe(
        userData => {
          ruta = userData;
          nombreRuta = ruta.route_long_name.substring(0, 3);
          if(id!=null)
          this.service.findStopTimeByRouteId(id, nombreRuta).subscribe(
            userData => {
              this.stopTimes = userData
            }
          );
        }
      );


    }
  }

}
