import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Employee} from "../model/employee/employee";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  // private basePath='/api/authenticate/';
  private backendURL: string="http://localhost:8095/";
  private employee:Employee=new Employee();

  constructor(private http: HttpClient) { }

  login(username:string, password:string){
    //encriptamos con btoa (binaryToAsKey)
    const headers=new HttpHeaders({Authorization: 'Basic '+btoa(username + ':' + password)});
    return this.http.post(`${this.backendURL+"login"}`,null, {headers, responseType:'text' as 'json'});
  }

  // getUsers(){
  //   //encriptamos con btoa (binaryToasKey
  //   const headers=new HttpHeaders({Authorization: 'Basic '+btoa(username + ':' + password)});
  //   return this.http.get(this.backendURL+"getEmployees", {headers,responseType:'text' as 'json'});
  // }

}
