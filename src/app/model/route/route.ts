import {Route_stop} from "../route_stop/route_stop";

export class Route {

  route_id:string;
  route_short_name:string;
  route_long_name:string;

  stops:Set<Route_stop>;
}
