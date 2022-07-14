import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Route_stop} from "../model/route_stop/route_stop";
import {HttpClient} from "@angular/common/http";
import {Route} from "../model/route/route";

@Injectable({
  providedIn: 'root'
})
export class RutaService {

  private backendURL: string="http://localhost:8095/";

  constructor(private httpClient:HttpClient) { }

  findRutaByEstacion(origen_id:String, destino_id:string): Observable<Route_stop[]>{
    return this.httpClient.get<Route_stop[]>(`${this.backendURL}`+"route/"+origen_id+"/"+destino_id);

  }

  findAllRoutes(): Observable<Route[]>{
    return this.httpClient.get<Route[]>(`${this.backendURL}`+"routes");
  }
}
