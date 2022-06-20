import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Employee} from "../model/employee/employee";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private backendURL: string = "http://localhost:8095/";

  constructor(private http: HttpClient) { }

  login(employee: Employee) {
    // var httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json'
    //   })
    // }
    return this.http.post<any>(`${this.backendURL}` +"login", employee);
  }
}
