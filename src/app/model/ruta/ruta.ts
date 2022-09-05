import {Route_stop} from "../route_stop/route_stop";

export class Ruta {

  ruta_id:string;
  ruta_corto:string;
  ruta_largo:string;

  stops:Set<Route_stop>;
}
