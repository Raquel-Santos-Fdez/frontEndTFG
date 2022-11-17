import {Solicitud} from "./solicitud";

export class SolicitudVacaciones extends Solicitud {

  fechaFinVacaciones:Date;


  constructor() {
    super()
    this.type="solicitudVacaciones";
  }



}
