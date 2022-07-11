import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Estacion} from "../model/estacion/estacion";
import {Stop} from "../model/stop/stop";
import {StopTime} from "../model/stop_time/stop-time";
import {Route} from "../model/route/route";
import {Jornada} from "../model/jornada/jornada";
import {Route_stop} from "../model/route_stop/route_stop";

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private backendURL: string="http://localhost:8095/";

  constructor(private httpClient:HttpClient) {

  }

  findStopTimeByRouteId(route_id: String, nombreRuta: string): Observable<StopTime[]>{
    return this.httpClient.get<StopTime[]>(`${this.backendURL}`+"stop_times/"+route_id+"/"+nombreRuta);
  }

  findRouteById(id: String): Observable<Route>{
    return this.httpClient.get<Route>(`${this.backendURL}`+"routes/"+id);
  }



  findAllStopTimes(): Observable<StopTime[]>{
    return this.httpClient.get<StopTime[]>(`${this.backendURL}`+"stop_times");
  }

  // findRoutesByStop(stop: Stop) {
  //   return this.httpClient.get<Route[]>(`${this.backendURL}`+"route_by_stop/"+stop.stop_id);
  // }

  findTimeByRutaStop(route_id: String, stop_id:String) {
    return this.httpClient.get<StopTime[]>(`${this.backendURL}`+"stop_times/"+route_id+"/"+stop_id).pipe(map(response=>response));
  }


}
