import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Estacion} from "../model/estacion/estacion";
import {Stop} from "../model/stop/stop";
import {StopTime} from "../model/stop_time/stop-time";
import {Route} from "../model/route/route";
import {Jornada} from "../model/jornada/jornada";

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

  findAllEstaciones(): Observable<Estacion[]>{
    return this.httpClient.get<Estacion[]>(`${this.backendURL}`+"estaciones");
  }

  findAllStops(): Observable<Stop[]>{
    return this.httpClient.get<Stop[]>(`${this.backendURL}`+"stops");
  }

  findAllStopTimes(): Observable<StopTime[]>{
    return this.httpClient.get<StopTime[]>(`${this.backendURL}`+"stop_times");
  }

  findAllRoutes(): Observable<Route[]>{
    return this.httpClient.get<Route[]>(`${this.backendURL}`+"routes");
  }

}
