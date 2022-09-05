export class Empleado {

  id: bigint;
  name:string;
  surname:string;
  username:string;
  email:string;
  dni:string;
  password:string;
  role:Rol;

}

export enum Rol{
  MAQUINISTA, REVISOR, ADMIN
}
