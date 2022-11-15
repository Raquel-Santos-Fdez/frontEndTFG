import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Solicitud} from "../model/solicitud/solicitud";
import {SolicitudIntercambio} from "../model/solicitud/solicituIntercambio";
import {SolicitudSimple} from "../model/solicitud/solicitudSimple";
import {SolicitudVacaciones} from "../model/solicitud/solicitudVacaciones";
import {Empleado} from "../model/empleado/empleado";


@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  private backendURL: string = "http://localhost:8095/";

  constructor(private httpClient: HttpClient) {

  }

  getAllSolicitudesPendientes(): Observable<Solicitud[]> {
    return this.httpClient.get<Solicitud[]>(`${this.backendURL}` + "solicitudes/ver-solicitudes-pendientes/");
  }

  aceptarSolicitud(solicitud:Solicitud) {
    return this.httpClient.put(`${this.backendURL}` + "solicitudes/aceptar-solicitud", solicitud)
  }

  rechazarSolicitud(id: bigint) {
    return this.httpClient.put(`${this.backendURL}` + "solicitudes/rechazar-solicitud", id)
  }

  solicitarVacaciones(solicitud: SolicitudVacaciones){
    return this.httpClient.post(`${this.backendURL}` + "solicitudes/solicitar-vacaciones/", solicitud)
  }

  findNotOwnSolicitudes(empleado: Empleado):Observable<SolicitudIntercambio[]> {
    return this.httpClient.put<SolicitudIntercambio[]>(`${this.backendURL}` + "solicitudes/find-others-solicitudes/" ,empleado);
  }

  findOwnSolicitudes(id: bigint) {
    return this.httpClient.get<Solicitud[]>(`${this.backendURL}` + "solicitudes/find-own-solicitudes/" + id);
  }

  findSolicitudesVacaciones(idEmpleado: bigint) {
    return this.httpClient.get<SolicitudVacaciones[]>(`${this.backendURL}` + "solicitudes/find-solicitudes-vacaciones/" +idEmpleado);
  }

  findSolicitudesVacacionesPendientes(idEmpleado:bigint){
    return this.httpClient.get<SolicitudVacaciones[]>(`${this.backendURL}` + "solicitudes/find-solicitudes-vacaciones-pendientes/" +idEmpleado);
  }

  existeSolicitud(fecha:String, idEmpleado:bigint){
    return this.httpClient.get<boolean>(`${this.backendURL}` + "solicitudes/existeSolicitud/" +fecha+"/"+idEmpleado);
  }

  existenVacacionesByFechaEmpleado(fecha:string, idEmpleado:bigint){
    return this.httpClient.get<boolean>(`${this.backendURL}` + "solicitudes/existenVacacionesByFechaEmpleado/" +fecha+"/"+idEmpleado);
  }

}
