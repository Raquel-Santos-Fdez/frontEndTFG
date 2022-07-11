import {Time} from "@angular/common";
import {Jornada} from "../jornada/jornada";
import {Tren} from "../tren/tren";
import {Tarea_stop} from "./tarea_stop";

export class Tarea {

  id:bigint;

  descripcion:String;
  horaSalida:Time;
  horaFin:Time;
  anden:number;


  tren:Tren;

  stops:Set<Tarea_stop>;

  jornada:Jornada;

  constructor() {
  }
}
