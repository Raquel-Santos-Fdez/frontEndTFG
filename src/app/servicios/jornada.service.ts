import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {observable, Observable} from "rxjs";
import {Tarea} from "../model/tarea/tarea";
import {Solicitud} from "../model/solicitud/solicitud";
import {Stop} from "../model/stop/stop";
import {SolicitudIntercambio} from "../model/solicitud/solicituIntercambio";
import {SolicitudSimple} from "../model/solicitud/solicitudSimple";
import {Incidencia} from "../model/incidencia/incidencia";
import {Jornada} from "../model/jornada/jornada";
import {DialogDetallesJornada} from "../vistas/jornada/consultar-jornada/consultar-jornada.component";
import {Situacion} from "../model/tarea/tarea_stop";


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


  checkCambioJornada(id: bigint, fecha: string, fechaDescanso: string) {

    let jornadas = this.httpClient.get<Jornada[]>(`${this.backendURL}` + "jornada/checkCambioJornada/" + id + "/" + fecha + "/" + fechaDescanso)
    let listJornadas: Jornada[] = [];
    jornadas.subscribe(jornada => {
      listJornadas = jornada as Jornada[]

    })

    if (listJornadas.length == 0)
      return false;

    return true;
  }

  aceptarSolicitud(id: bigint) {
    return this.httpClient.put(`${this.backendURL}` + "jornada/aceptar_solicitud", id)
  }

  rechazarSolicitud(id: bigint) {
    return this.httpClient.put(`${this.backendURL}` + "jornada/rechazar_solicitud", id)
  }

  enviarSolicitud(solicitud: SolicitudSimple): Observable<any> {
    return this.httpClient.post(`${this.backendURL}` + "jornada/solicitar_vacaciones/", solicitud)
  }

  addSolicitudIntercambio(solicitudIntercambio: SolicitudIntercambio): Observable<any> {
    return this.httpClient.post(`${this.backendURL}` + "jornada/solicitar_intercambio/", solicitudIntercambio)
  }


  reasignar(solicitud: SolicitudIntercambio) {
    return this.httpClient.put(`${this.backendURL}` + "jornada/reasignar", solicitud)
  }

  realizarCambio(id: bigint, idEmployee: bigint) {
    return this.httpClient.put(`${this.backendURL}` + "jornada/realizarCambio", {id, idEmployee})
  }

  addTarea(tarea: Tarea) {
    return this.httpClient.post(`${this.backendURL}` + "tarea/addTarea/", tarea)
  }

  addTareaStop(tarea: Tarea, origen: Stop, inicio: string) {
    return this.httpClient.post(`${this.backendURL}` + "tarea_stop/addTareaStop", {tarea, origen, inicio})

  }
}
