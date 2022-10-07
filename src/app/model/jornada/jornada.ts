import {Empleado} from "../empleado/empleado";
import {Tarea} from "../tarea/tarea";

export class Jornada {

  id: bigint;
  date:string;
  diaLibre:boolean;

  tareas: Tarea[]=[];
  empleado:Empleado;

  constructor(date:string, empleado:Empleado) {
    this.date= date;
    this.empleado=empleado
  }
}
