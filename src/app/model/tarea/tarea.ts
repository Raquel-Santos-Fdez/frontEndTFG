import {Time} from "@angular/common";
import {Jornada} from "../jornada/jornada";
import {Tren} from "../tren/tren";
import {Stop} from "../stop/stop";
import {Tarea_stop} from "./tarea_stop";

export class Tarea {

  id:bigint;

  descripcion:String;
  horaSalida:Time;
  anden:number;

  jornada:Jornada;

  tren:Tren;

  stops:Set<Tarea_stop>;

  constructor() {
  }
}
