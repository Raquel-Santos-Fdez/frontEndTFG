import {Estacion} from "../estacion/estacion";
import {Tarea} from "./tarea";

export class Tarea_stop{

  id:bigint
  situacion:Situacion
  estacion:Estacion
  tarea:Tarea

  constructor(situacion:Situacion, estacion: Estacion) {
    this.situacion=situacion;
    this.estacion=estacion;
  }

}

export enum Situacion{
  INICIO, FINAL
}
