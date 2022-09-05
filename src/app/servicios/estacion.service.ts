import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Estacion} from "../model/estacion/estacion";

@Injectable({
  providedIn: 'root'
})
export class EstacionService {

  private backendURL: string="http://localhost:8095/";

  constructor(private httpClient:HttpClient) { }

  findAllStops(): Observable<Estacion[]>{
    return this.httpClient.get<Estacion[]>(`${this.backendURL}`+"stops");
  }
}
