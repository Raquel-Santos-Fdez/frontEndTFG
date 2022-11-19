import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Horario} from "../model/horario/horario";
import {Ruta} from "../model/ruta/ruta";

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private backendURL: string="http://localhost:8095/";

  constructor(private httpClient:HttpClient) {

  }

  findHorarioByRutaEstacion(rutaId: String, estacionId:String) {
    return this.httpClient.get<Horario[]>(`${this.backendURL}`+"horarios/"+rutaId+"/"+estacionId).pipe(map(response=>response));
  }


}
