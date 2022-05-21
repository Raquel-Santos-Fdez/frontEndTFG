import { Component, OnInit } from '@angular/core';
import {Estacion} from "../../model/estacion/estacion";
import {BackendService} from "../../servicios/backend.service";

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css']
})
export class HorariosComponent implements OnInit {

  estaciones:Estacion[]=[];
  constructor(private service:BackendService) { }

  ngOnInit(): void {
    this.getEstaciones();
  }

  private getEstaciones(){
    this.service.findAllEstaciones().subscribe(
      userData => {this.estaciones = userData}
    );
  }
}
