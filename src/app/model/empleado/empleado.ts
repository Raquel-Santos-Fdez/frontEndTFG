export class Empleado {

  id: bigint;
  name:string;
  surname:string;
  username:string;
  email:string;
  dni:string;
  password:string;
  role:Rol;
  nDiasLibres:number;

}

export enum Rol{
  MAQUINISTA, REVISOR, ADMIN
}
