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
import {SolicitudVacaciones} from "../model/solicitud/solicitudVacaciones";
import {Empleado} from "../model/empleado/empleado";


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

  findStopByTareaStop(id: bigint) {
    return this.httpClient.get<Estacion>(`${this.backendURL}` + "tareaStop/" + id);
  }

  findNotOwnSolicitudes(empleado: Empleado):Observable<SolicitudIntercambio[]> {
    return this.httpClient.put<SolicitudIntercambio[]>(`${this.backendURL}` + "solicitudes/find-others-solicitudes/" ,empleado);
  }

  findOwnSolicitudes(id: bigint) {
    return this.httpClient.get<Solicitud[]>(`${this.backendURL}` + "solicitudes/find-own-solicitudes/" + id);
  }

  addJornada(jornada: Jornada) {
    return this.httpClient.post<Jornada>(`${this.backendURL}` + "jornada/addJornada/", jornada)
  }

  enviarSolicitud(solicitud: SolicitudSimple){
    return this.httpClient.post(`${this.backendURL}` + "jornada/enviar-solicitud/", solicitud)
  }

  addSolicitudIntercambio(solicitudIntercambio: Solicitud): Observable<any> {
    return this.httpClient.post(`${this.backendURL}` + "jornada/solicitar-intercambio/", solicitudIntercambio)
  }


  reasignar(solicitud: SolicitudIntercambio) {
    return this.httpClient.put(`${this.backendURL}` + "jornada/reasignar", solicitud)
  }

  addTarea(tarea: Tarea): Observable<Tarea> {
    return this.httpClient.post<Tarea>(`${this.backendURL}` + "tarea/addTarea/", tarea)
  }

  findTareaById(id: BigInt): Observable<Tarea> {
    return this.httpClient.get<Tarea>(`${this.backendURL}` + "tarea/" + id)

  }

  addNuevaTareaStop(tareaStop: Tarea_stop) {
    return this.httpClient.post(`${this.backendURL}` + "tareaStop/addNuevaTareaStop", tareaStop)
  }

  findSolicitudByFechaEmpleado(date: string, id: bigint) {
    return this.httpClient.get(`${this.backendURL}` + "solicitudes/findSolicitudByFechaEmpleado/"+date+"/"+id)
  }

  findSolicitudesVacaciones(idEmpleado: bigint) {
    return this.httpClient.get<Solicitud[]>(`${this.backendURL}` + "solicitudes/find-solicitudes-vacaciones/" +idEmpleado);
  }

  solicitarVacaciones(solicitud: SolicitudVacaciones){
    return this.httpClient.post(`${this.backendURL}` + "jornada/solicitar-vacaciones/", solicitud)
  }

}
