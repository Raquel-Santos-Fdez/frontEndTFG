import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Tarea} from "../model/tarea/tarea";
import {Solicitud} from "../model/solicitud/solicitud";
import {SolicitudIntercambio} from "../model/solicitud/solicituIntercambio";
import {SolicitudSimple} from "../model/solicitud/solicitudSimple";
import {Jornada} from "../model/jornada/jornada";
import {Time} from "@angular/common";


@Injectable({
  providedIn: 'root'
})
export class JornadaService {
  private backendURL: string = "http://localhost:8095/";

  constructor(private httpClient: HttpClient) {

  }

  findTareasByDateEmpleado(date: Date, idEmployee: bigint): Observable<Tarea[]> {
    return this.httpClient.get<Tarea[]>(`${this.backendURL}` + "jornada/consultar/" + date + "/" + idEmployee);
  }

  findJornadaByEmployee(id: bigint) {
    return this.httpClient.get<Jornada[]>(`${this.backendURL}` + "jornada/findByEmpleado/" + id)
  }

  findJornadaByDate(date: Date) {
    return this.httpClient.get<Jornada[]>(`${this.backendURL}` + "jornada/findByDate/" + date);
  }

  findJornadaByDateEmpleado(date: Date, idEmployee: bigint) {
    return this.httpClient.get<Jornada[]>(`${this.backendURL}` + "jornada/findJornadaByDateEmpleado/" + date + "/" + idEmployee);
  }

  findTareaById(id: bigint)  {
    return this.httpClient.get<Tarea>(`${this.backendURL}` + "tarea/" + id)
  }

    existeTarea(fecha: Date, idEmpleado: bigint, horaSalida: Time, horaFin: Time) {
    return this.httpClient.get<boolean>(`${this.backendURL}` + "jornada/existeTarea/"+
      fecha+ "/" + idEmpleado+ "/" + horaSalida+ "/" + horaFin)
  }

  addJornada(jornada: Jornada) {
    return this.httpClient.post<Jornada>(`${this.backendURL}` + "jornada/addJornada/", jornada)
  }

  enviarSolicitud(solicitud: SolicitudSimple){
    return this.httpClient.post(`${this.backendURL}` + "solicitudes/enviar-solicitud/", solicitud)
  }

  addSolicitudIntercambio(solicitudIntercambio: Solicitud): Observable<any> {
    return this.httpClient.post(`${this.backendURL}` + "solicitudes/solicitar-intercambio/", solicitudIntercambio)
  }

  reasignar(solicitud: SolicitudIntercambio) {
    return this.httpClient.put(`${this.backendURL}` + "jornada/reasignar", solicitud)
  }


}
