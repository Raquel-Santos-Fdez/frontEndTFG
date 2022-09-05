import {Component, OnInit, ViewChild} from '@angular/core';
import {MatMenuTrigger} from "@angular/material/menu";
import {HttpClient} from "@angular/common/http";
import {Empleado, Rol} from "../../model/empleado/empleado";

@Component({
  selector: 'nav-component',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  empleado:Empleado;
  isLogin:boolean=false;



  constructor( private http:HttpClient) {
  }

  ngOnInit(): void {
    this.empleado = JSON.parse(localStorage.getItem("usuario")||'{}');

    if(Object.keys(this.empleado).length!=0)
      this.isLogin = true;


  }

  ///ponemos undefined porque sino hay que inicializarlo de alguna manera
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger | undefined;

  someMethod() {
    //util en caso de que sea undefined
    // @ts-ignore
    this.trigger.openMenu();
  }

  logout() {

    localStorage.removeItem("usuario");
    location.href="/";

  }
}
