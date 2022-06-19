export abstract class Solicitud {

  id: bigint;
  fecha:string;
  motivo:string;

  estado:EstadoEnum=EstadoEnum.PENDIENTE;

}

enum EstadoEnum{
  PENDIENTE, ACEPTADA, RECHAZADA, REASIGNADA
}
