import {Ruta_estacion} from "../ruta_estacion/ruta_estacion";

export class Ruta {

  ruta_id:string;
  ruta_corto:string;
  ruta_largo:string;

  stops:Set<Ruta_estacion>;
}
