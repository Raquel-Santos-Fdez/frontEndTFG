import { Injectable } from '@angular/core';
import {Estacion} from "../model/estacion/estacion";
import {Ruta_estacion} from "../model/ruta_estacion/ruta_estacion";
;

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  constructor() { }

  listRutas:Ruta_estacion[]=[];
  origen:Estacion;
}
