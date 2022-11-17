import {Empleado} from "../empleado/empleado";

export abstract class Solicitud {

  id: bigint;
  fecha:Date;
  motivo:MotivoAusencia;
  type:string;

  estado:EstadoEnum=EstadoEnum.PENDIENTE;

  empleado:Empleado;


  constructor() {
  }


}

export enum EstadoEnum{
  PENDIENTE, ACEPTADA, RECHAZADA, REASIGNADA
}

export enum MotivoAusencia{
  LICENCIA, OTRO_MOTIVO, FORMACION, VISITA_MEDICA, VACACIONES
}
