import { Injectable } from '@angular/core';
import {map, Observable} from "rxjs";
import {Ruta_estacion} from "../model/ruta_estacion/ruta_estacion";
import {HttpClient} from "@angular/common/http";
import {Ruta} from "../model/ruta/ruta";
import {Horario} from "../model/horario/horario";

@Injectable({
  providedIn: 'root'
})
export class RutaService {

  private backendURL: string="http://localhost:8095/";

  constructor(private httpClient:HttpClient) { }

  findRutaByEstacion(origen_id:String, destino_id:string): Observable<Ruta_estacion[]>{
    return this.httpClient.get<Ruta_estacion[]>(`${this.backendURL}`+"ruta/"+origen_id+"/"+destino_id);

  }

  findAllRoutes(): Observable<Ruta[]>{
    return this.httpClient.get<Ruta[]>(`${this.backendURL}`+"rutas");
  }

  findHorarioByRutaEstacion(rutaId: String, estacionId:String) {
    return this.httpClient.get<Horario[]>(`${this.backendURL}`+"horarios/"+rutaId+"/"+estacionId).pipe(map(response=>response));
  }
}
