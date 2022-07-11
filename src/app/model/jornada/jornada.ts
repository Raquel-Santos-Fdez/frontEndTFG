import {Employee} from "../employee/employee";
import {Tarea} from "../tarea/tarea";

export class Jornada {

  id: bigint;
  date:Date;

  tareas: Set<Tarea>;
  employee:Employee;

  constructor(date:Date, employee:Employee) {
    this.date=date;
    this.employee=employee
  }
}
