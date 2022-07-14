import {Stop} from "../stop/stop";
import {Tarea} from "./tarea";

export class Tarea_stop{

  id:bigint
  situacion:Situacion
  stop:Stop
  tarea:Tarea

  // constructor(situacion:Situacion, stop: Stop) {
  //   this.situacion=situacion;
  //   this.stop=stop;
  // }

  constructor() {
  }
}

export enum Situacion{
  INICIO, FINAL
}
