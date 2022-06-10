import {Employee} from "../employee/employee";
import {Tarea} from "../tarea/tarea";

export class Jornada {

  id: bigint;
  date:Date;
  tarea:Tarea;
  employee:Employee;
}
