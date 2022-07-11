import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Route} from "../model/route/route";
import {Employee} from "../model/employee/employee";

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  private backendURL: string="http://localhost:8095/";

  constructor(private httpClient:HttpClient) { }

  findAllEmpleados() {
    return this.httpClient.get<Employee[]>(`${this.backendURL}`+"empleados");
  }

  findEmpleadoById(id:any){
    return this.httpClient.get<Employee>(`${this.backendURL}`+"empleado/"+id);
  }

  addEmployee(empleado: Employee) {
    return this.httpClient.post(`${this.backendURL}` + "empleados/addEmpleado/", empleado)

  }
}
