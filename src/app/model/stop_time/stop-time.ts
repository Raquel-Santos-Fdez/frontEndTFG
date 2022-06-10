import {Stop} from "../stop/stop";
import {Trip} from "../trip/trip";

export class StopTime {

  id:number;

  trip:Trip;
  stop:Stop;
  arrival_time:String;
  departure_time:String;
  stop_sequence:String;

}
