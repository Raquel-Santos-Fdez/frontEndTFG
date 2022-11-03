import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {StopTime} from "../model/stop_time/stop-time";
import {Ruta} from "../model/ruta/ruta";

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private backendURL: string="http://localhost:8095/";

  constructor(private httpClient:HttpClient) {

  }

  findStopTimeByRouteId(route_id: String, nombreRuta: string): Observable<StopTime[]>{
    return this.httpClient.get<StopTime[]>(`${this.backendURL}`+"stopTimes/"+route_id+"/"+nombreRuta);
  }

  findRouteById(id: String): Observable<Ruta>{
    return this.httpClient.get<Ruta>(`${this.backendURL}`+"routes/"+id);
  }



  findAllStopTimes(): Observable<StopTime[]>{
    return this.httpClient.get<StopTime[]>(`${this.backendURL}`+"stopTimes");
  }

  // findRoutesByStop(stop: Estacion) {
  //   return this.httpClient.get<Ruta[]>(`${this.backendURL}`+"route_by_stop/"+stop.stop_id);
  // }

  findTimeByRutaStop(route_id: String, stop_id:String) {
    return this.httpClient.get<StopTime[]>(`${this.backendURL}`+"stopTimes/"+route_id+"/"+stop_id).pipe(map(response=>response));
  }


}
