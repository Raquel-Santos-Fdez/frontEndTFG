import {Solicitud} from "./solicitud";
import {Empleado} from "../empleado/empleado";
import {EstadoEnum} from "./solicitud"

export class SolicitudSimple extends Solicitud {



  constructor() {
    super()
    this.type="solicitudSimple";
  }



}
