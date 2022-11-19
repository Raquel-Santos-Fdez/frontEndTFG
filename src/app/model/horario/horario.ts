import {Estacion} from "../estacion/estacion";
import {Trayecto} from "../trayecto/trayecto";
import {Time} from "@angular/common";

export class Horario {

  id:number;

  trayecto:Trayecto;
  estacion:Estacion;
  hora_llegada:Time;
  hora_salida:Time;

}
