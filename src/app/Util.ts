import {Time} from "@angular/common";

export class Util{

  formatearHora(hora:Time){
    let horas=hora+"";
    return horas.split(":")[0]+":"+horas.split(":")[1]

  }
}
