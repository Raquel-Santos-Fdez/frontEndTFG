
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatMenuTrigger} from "@angular/material/menu";
import {HttpClient} from "@angular/common/http";
import {isEmpty} from "rxjs";
import {Employee} from "../../model/employee/employee";

@Component({
  selector: 'nav-component',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  employee:Employee;
  isLogin:boolean=false;

  constructor( private http:HttpClient) {
  }

  ngOnInit(): void {
    this.employee = JSON.parse(localStorage.getItem("usuario")||'{}');

    if(Object.keys(this.employee).length!=0)
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
