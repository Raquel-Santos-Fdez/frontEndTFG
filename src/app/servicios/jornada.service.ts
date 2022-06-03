import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Jornada} from "../model/jornada/jornada";
import {Tarea} from "../model/tarea/tarea";


@Injectable({
  providedIn: 'root'
})
export class JornadaService{
  private backendURL: string="http://localhost:8095/";

  constructor(private httpClient:HttpClient) {

  }

  findJornadaByDate(date:Date): Observable<Tarea[]>{
    return this.httpClient.get<Tarea[]>(`${this.backendURL}`+"jornada/consultar/"+date+"/1");

    // const header = new HttpHeaders(`Content-Type`:"application/x-www-form-urlencoded" );
    // return this.httpClient.post<Jornada[]>(`${this.backendURL+"jornada/consultar"}`, {dateParam: date, idEmployee: id});
  }
}
