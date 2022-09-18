import {Empleado} from "../empleado/empleado";

export abstract class Solicitud {

  id: bigint;
  fecha:string;
  motivo:string;

  estado:EstadoEnum=EstadoEnum.PENDIENTE;

  empleado:Empleado;


  constructor() {
  }


}

export enum EstadoEnum{
  PENDIENTE, ACEPTADA, RECHAZADA, REASIGNADA
}
