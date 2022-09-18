import {EstadoEnum, Solicitud} from "./solicitud";
import {Empleado} from "../empleado/empleado";

export class SolicitudIntercambio extends Solicitud{

  fechaDescanso:string

  constructor() {
    super();
  }
}
