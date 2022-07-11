import { Injectable } from '@angular/core';
import {Incidencia} from "../model/incidencia/incidencia";
import {HttpClient} from "@angular/common/http";
import {Tren} from "../model/tren/tren";

@Injectable({
  providedIn: 'root'
})
export class TrenService {

  private backendURL: string = "http://localhost:8095/";

  constructor(private httpClient: HttpClient) { }

  getIncidenciasPending(id: bigint) {
    return this.httpClient.get<Incidencia[]>(`${this.backendURL}` + "tren/getIncidenciasPending/" + id);
  }

  addIncidencia(incidencia: Incidencia) {
    return this.httpClient.post(`${this.backendURL}` + "tren/addIncidencia/", incidencia)
  }

  findTrenById(idTren: bigint) {
    return this.httpClient.get<Tren>(`${this.backendURL}` + "tren/findTrenById/" + idTren);

  }
}
