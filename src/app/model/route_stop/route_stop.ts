import {Estacion} from "../estacion/estacion";
import {Ruta} from "../ruta/ruta";

export class Route_stop {
  id:bigint
  stop:Estacion
  ruta:Ruta
  orderParada:number

}
