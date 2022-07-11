import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Stop} from "../model/stop/stop";

@Injectable({
  providedIn: 'root'
})
export class EstacionService {

  private backendURL: string="http://localhost:8095/";

  constructor(private httpClient:HttpClient) { }

  findAllStops(): Observable<Stop[]>{
    return this.httpClient.get<Stop[]>(`${this.backendURL}`+"stops");
  }
}
