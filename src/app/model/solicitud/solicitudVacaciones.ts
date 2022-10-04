import {Solicitud} from "./solicitud";

export class SolicitudVacaciones extends Solicitud {

  fechaFinVacaciones:string;


  constructor() {
    super()
    this.type="solicitudVacaciones";
  }



}
