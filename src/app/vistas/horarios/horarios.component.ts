import {Component, NgModule, OnInit} from '@angular/core';
import {BackendService} from "../../servicios/backend.service";
import {Stop} from "../../model/stop/stop";
import {StopTime} from "../../model/stop_time/stop-time";
import {Route} from "../../model/route/route";
import {HorariosRouting} from "./horarios.routing";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css']
})

export class HorariosComponent implements OnInit {

  routes:Route[];

  constructor(private service:BackendService, private router:Router) {
  }

  ngOnInit(): void {

    this.service.findAllRoutes().subscribe(
      userData => {this.routes = userData}
    );
  }

  showTablaHorarios(id:String){
    this.router.navigate(['tabla_horarios',id]);
  }

}
