import {Estacion} from "../estacion/estacion";
import {Trip} from "../trip/trip";

export class StopTime {

  id:number;

  trip:Trip;
  stop:Estacion;
  arrival_time:String;
  departure_time:String;
  stop_sequence:String;

}
