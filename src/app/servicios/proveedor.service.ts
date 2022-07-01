import { Injectable } from '@angular/core';
import {Stop} from "../model/stop/stop";
import {Route_stop} from "../model/route_stop/route_stop";
;

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  constructor() { }

  listRutas:Route_stop[]=[];
  origen:Stop;
}
