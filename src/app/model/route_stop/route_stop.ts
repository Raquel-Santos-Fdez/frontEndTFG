import {Estacion} from "../estacion/estacion";
import {Ruta} from "../ruta/ruta";

export class Route_stop {
  id:bigint
  estacion:Estacion
  ruta:Ruta
  orderParada:number

}
