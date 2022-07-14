import {Component, OnInit} from '@angular/core';
import {Stop} from "../../../model/stop/stop";
import {EstacionService} from "../../../servicios/estacion.service";

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

  //Markers: Estaciones
  marker: Marker;
  markers: Marker[]=[];
  stops:Stop[];

  located: boolean = false;

  // InfoWindow
  infoDisplayed: boolean =false;
  infoName: string ="";
  infoDesc: string="";


  //Map options
  center: { lat: number; lng: number; } ={lat:0, lng:0};
  options: google.maps.MapOptions = {
    mapTypeId: 'satellite',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    maxZoom: 17,
    minZoom: 5,
  };

  constructor(private paradaService:EstacionService) {

  }

  ngOnInit(): void {
    this.center = { lat:43.267258, lng: -5.805951 };
    this.getStops();
    this.loadDatabase();
  }

  getCurrentPosition() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
    this.getCenter();
  }

  getPosition(latitude: number, longitude: number) {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: latitude,
        lng: longitude,
      };
    });
    this.getCenter();
  }

  getCenter() {
    return this.center;
  }

  private loadDatabase(){
    setTimeout(() => {
      var i;
      for(i=0; i<this.stops.length;i++){
        this.addMarker(this.stops[i].stop_lat, this.stops[i].stop_lon, this.stops[i].stop_name);
      }
    }, 1000);

  }

  private addMarker(latitude: number, longitude: number, label:string,) {
    this.marker = {
      latitud: latitude,
      longitud: longitude,
      center: { lat: latitude, lng: longitude },
      label:label,
    };

    this.markers.push(this.marker);
  }

  /**
   * InfoWindow
   */
  openInfoWindow(myMarker:Marker) {
    this.infoDisplayed = true;
    this.infoDesc = myMarker.label;
  }

  closeCard() {
    this.infoDisplayed = false;
  }

  private getStops(){
    this.paradaService.findAllStops().subscribe(
      userData => {this.stops = userData}
    );
  }


}

interface Marker {
  center: { lat: number; lng: number };
  latitud: number;
  longitud: number;
  label:string;
}
