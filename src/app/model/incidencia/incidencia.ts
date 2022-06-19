import {Tren} from "../tren/tren";

export class Incidencia {
  id:bigint
  descripcion:string
  tren:Tren

  constructor(descripcion:string, tren:Tren) {
    this.descripcion=descripcion
    this.tren=tren
  }
}
