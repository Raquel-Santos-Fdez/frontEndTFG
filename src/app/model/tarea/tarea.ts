import {Time} from "@angular/common";
import {Tren} from "../tren/tren";
import {Tarea_estacion} from "./tarea_estacion";

export class Tarea {

  id:bigint;

  descripcion:String;
  horaSalida:Time;
  horaFin:Time;
  anden:number;


  tren:Tren;

  stops:Tarea_estacion[]=[];


  constructor() {
  }
}
