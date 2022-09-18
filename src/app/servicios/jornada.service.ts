import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Tarea} from "../model/tarea/tarea";
import {Solicitud} from "../model/solicitud/solicitud";
import {Estacion} from "../model/estacion/estacion";
import {SolicitudIntercambio} from "../model/solicitud/solicituIntercambio";
import {SolicitudSimple} from "../model/solicitud/solicitudSimple";
import {Jornada} from "../model/jornada/jornada";
import {Tarea_stop} from "../model/tarea/tarea_stop";
import {map} from "rxjs/operators"


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
    return this.httpClient.get<Solicitud[]>(`${this.backendURL}` + "jornada/ver-solicitudes-vacaciones/");
  }

  findStopByTareaStop(id: bigint) {
    return this.httpClient.get<Estacion>(`${this.backendURL}` + "tareaStop/" + id);
  }

  findNotOwnSolicitudes(id: bigint): Observable<SolicitudIntercambio[]> {
    return this.httpClient.get<SolicitudIntercambio[]>(`${this.backendURL}` + "jornada/find-others-solicitudes/" + id);
  }

  findOwnSolicitudes(id: bigint) {
    return this.httpClient.get<Solicitud[]>(`${this.backendURL}` + "jornada/find-own-solicitudes/" + id);
  }

  addJornada(jornada: Jornada) {
    return this.httpClient.post<Jornada>(`${this.backendURL}` + "jornada/addJornada/", jornada)
  }


  checkCambioJornada(id: bigint, fecha: string, fechaDescanso: string) {

    let jornadas = this.httpClient.get<Jornada[]>(`${this.backendURL}` + "jornada/checkCambioJornada/" + id + "/" + fecha + "/" + fechaDescanso)
    let listJornadas: Jornada[] = [];
    jornadas.subscribe(jornada => {
      listJornadas = jornada as Jornada[]

    })

    return listJornadas.length != 0;


  }

  aceptarSolicitud(solicitud:Solicitud) {
    return this.httpClient.put(`${this.backendURL}` + "solicitudes/aceptar-solicitud", solicitud)
  }

  rechazarSolicitud(id: bigint) {
    return this.httpClient.put(`${this.backendURL}` + "solicitudes/rechazar-solicitud", id)
  }

  enviarSolicitud(solicitud: SolicitudSimple): Observable<any> {
    return this.httpClient.post(`${this.backendURL}` + "jornada/solicitar-vacaciones/", solicitud)
  }

  addSolicitudIntercambio(solicitudIntercambio: SolicitudIntercambio): Observable<any> {
    return this.httpClient.post(`${this.backendURL}` + "jornada/solicitar-intercambio/", solicitudIntercambio)
  }


  reasignar(solicitud: SolicitudIntercambio) {
    return this.httpClient.put(`${this.backendURL}` + "jornada/reasignar", solicitud)
  }

  realizarCambio(id: bigint, idEmployee: bigint) {
    return this.httpClient.put(`${this.backendURL}` + "jornada/realizarCambio", {id, idEmployee})
  }

  addTarea(tarea: Tarea): Observable<Tarea> {
    return this.httpClient.post<Tarea>(`${this.backendURL}` + "tarea/addTarea/", tarea)
  }

  // addTareaStop( origen: Estacion, inicio: string): Observable<any> {
  //   return this.httpClient.post(`${this.backendURL}` + "tarea-stop/addTareaStop", {origen, inicio})
  // }
  //
  // assignTareaStop(id:bigint, tarea: Tarea) {
  //   return this.httpClient.put(`${this.backendURL}` + "tarea-stop/asignarTareaStop", {id, tarea})
  //
  // }

  // addTareaStop( origen: Estacion, inicio: string, tarea:Tarea): Observable<any> {
  //   return this.httpClient.post(`${this.backendURL}` + "tarea-stop/addTareaStop", {origen, inicio, tarea})
  // }

  findTareaById(id: BigInt): Observable<Tarea> {
    return this.httpClient.get<Tarea>(`${this.backendURL}` + "tarea/" + id)

  }

  addNuevaTareaStop(tareaStop: Tarea_stop) {
    return this.httpClient.post(`${this.backendURL}` + "tareaStop/addNuevaTareaStop", tareaStop)
  }

  findSolicitudByFechaEmpleado(date: string, id: bigint) {
    return this.httpClient.get(`${this.backendURL}` + "solicitudes/findSolicitudByFechaEmpleado/"+date+"/"+id)

  }

  gestionarSolicitudAceptada(id:Solicitud) {
     return this.httpClient.put(`${this.backendURL}` + 'solicitudes/gestionarSolicitudAceptada', id)
  }
}
