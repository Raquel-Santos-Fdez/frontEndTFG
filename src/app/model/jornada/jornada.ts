import {Empleado} from "../empleado/empleado";
import {Tarea} from "../tarea/tarea";

export class Jornada {

  id: bigint;
  date:Date;

  tareas: Tarea[]=[];
  empleado:Empleado;

  constructor(date:Date, empleado:Empleado) {
    this.date=date;
    this.empleado=empleado
  }
}
