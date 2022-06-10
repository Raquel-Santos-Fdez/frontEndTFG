import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Tarea} from "../model/tarea/tarea";
import {Solicitud} from "../model/solicitud/solicitud";
import {Stop} from "../model/stop/stop";
import {SolicitudIntercambio} from "../model/solicitud/solicituIntercambio";
import {SolicitudSimple} from "../model/solicitud/solicitudSimple";


@Injectable({
  providedIn: 'root'
})
export class JornadaService {
  private backendURL: string = "http://localhost:8095/";

  constructor(private httpClient: HttpClient) {

  }

  findJornadaByDate(date: Date): Observable<Tarea[]> {
    return this.httpClient.get<Tarea[]>(`${this.backendURL}` + "jornada/consultar/" + date + "/1");
  }

  getAllSolicitudesPendientes(): Observable<Solicitud[]> {
    return this.httpClient.get<Solicitud[]>(`${this.backendURL}` + "jornada/ver_solicitudes_vacaciones/");
  }

  findStopByTareaStop(id: bigint) {
    return this.httpClient.get<Stop>(`${this.backendURL}` + "tarea_stop/" + id);
  }

  findNotOwnSolicitudes(id: bigint): Observable<SolicitudIntercambio[]> {
    return this.httpClient.get<SolicitudIntercambio[]>(`${this.backendURL}` + "jornada/find_others_solicitudes/" + id);
  }

  findOwnSolicitudes(id: bigint) {
    return this.httpClient.get<SolicitudIntercambio[]>(`${this.backendURL}` + "jornada/find_own_solicitudes/" + id);
  }

  aceptarSolicitud(id: bigint) {
    return this.httpClient.put(`${this.backendURL}` + "jornada/aceptar_solicitud", id);
  }

  rechazarSolicitud(id: bigint) {
    return this.httpClient.put(`${this.backendURL}` + "jornada/rechazar_solicitud", id);
  }

  enviarSolicitud(solicitud: SolicitudSimple): Observable<any> {
    return this.httpClient.post(`${this.backendURL}` + "jornada/solicitar_vacaciones/", solicitud);
  }

  addSolicitudIntercambio(solicitudIntercambio: SolicitudIntercambio): Observable<any> {
    console.log(solicitudIntercambio);
    return this.httpClient.post(`${this.backendURL}` + "jornada/solicitar_intercambio/", solicitudIntercambio);
  }
}
