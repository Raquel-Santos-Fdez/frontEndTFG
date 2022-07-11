import { Component, OnInit } from '@angular/core';
import {Employee} from "../../model/employee/employee";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  employee:Employee;
  show:boolean;
  constructor() { }

  ngOnInit(): void {
    this.employee=JSON.parse(localStorage.getItem("usuario")||'{}');
    this.show=false;
  }

  mostrarPassword() {
   this.show=!this.show;
  }
}
