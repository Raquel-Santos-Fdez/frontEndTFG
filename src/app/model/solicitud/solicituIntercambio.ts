import {Solicitud} from "./solicitud";
import {Empleado} from "../empleado/empleado";

export class SolicitudIntercambio extends Solicitud{

  fechaDescanso:Date;
  nuevoEmpleado: Empleado;

  constructor() {
    super();
    this.type="solicitudIntercambio";
  }
}
