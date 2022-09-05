import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Empleado} from "../model/empleado/empleado";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private backendURL: string = "http://localhost:8095/";

  constructor(private http: HttpClient) { }

  login(employee: Empleado) {
    // var httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json'
    //   })
    // }
    return this.http.post<any>(`${this.backendURL}` +"login", employee);
  }
}
