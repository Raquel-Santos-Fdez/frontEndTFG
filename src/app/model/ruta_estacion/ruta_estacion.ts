import {Estacion} from "../estacion/estacion";
import {Ruta} from "../ruta/ruta";

export class Ruta_estacion {
  id:bigint
  estacion:Estacion
  ruta:Ruta
  orderParada:number

}
