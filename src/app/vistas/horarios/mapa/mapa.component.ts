import {Component, OnInit} from '@angular/core';
import {Estacion} from "../../../model/estacion/estacion";
import {EstacionService} from "../../../services/estacion.service";
import Polyline = google.maps.Polyline;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

  //Markers: Estaciones
  marker: Marker;
  markers: Marker[] = [];
  estaciones: Estacion[] = [];

  // InfoWindow
  infoDisplayed: boolean = false;
  infoName: string = "";
  infoDesc: string = "";


  //Map options
  center: { lat: number; lng: number; } = {lat: 0, lng: 0};
  options: google.maps.MapOptions = {
    mapTypeId: 'satellite',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    maxZoom: 17,
    minZoom: 5,
  };

  constructor(private estacionService: EstacionService,
  ) {
    // this.center=this.horariosComponent.center;

  }

  ngOnInit(): void {
    this.center = {lat: 43.267258, lng: -5.805951};

    this.getStops();
    this.loadDatabase();
  }

  reload(origen: any, destino:any) {
    navigator.geolocation.getCurrentPosition((position) => {
      var gOrigen = new google.maps.LatLng(origen.lat, origen.lng);
      var gDestino = new google.maps.LatLng(destino.lat, destino.lng);
      var objConfig = {
        zoom: 16,
        center: gOrigen,
        mapTypeId: "satellite"
      }
      var gMapa = new google.maps.Map(<HTMLElement>document.getElementById("contMapa"), objConfig)
      var configMOrigen={
        position: gOrigen,
        map:gMapa,
        title:origen.nombre
      }
      var configMDestino={
        position: gDestino,
        map:gMapa,
        title:destino.nombre
      }
      var mOrigen=new google.maps.Marker(configMOrigen);
      var mDestino=new google.maps.Marker(configMDestino);

      var bounds =new google.maps.LatLngBounds();
      bounds.extend(gOrigen);
      bounds.extend(gDestino);
      gMapa.fitBounds(bounds);

    });
    this.getCenter()
  }

  getCenter() {
    return this.center;
  }

  private loadDatabase() {
    setTimeout(() => {
      var i;
      for (i = 0; i < this.estaciones.length; i++) {
        this.addMarker(this.estaciones[i].latitud, this.estaciones[i].longitud, this.estaciones[i].nombre);
      }
    }, 1000);

  }

  private addMarker(latitude: number, longitude: number, label: string,) {
    this.marker = {
      latitud: latitude,
      longitud: longitude,
      center: {lat: latitude, lng: longitude},
      label: label,
    };

    this.markers.push(this.marker);
  }

  private getStops() {
    this.estacionService.findAllEstaciones().subscribe(
      userData => {
        this.estaciones = userData
      }
    );
  }


}

interface Marker {
  center: { lat: number; lng: number };
  latitud: number;
  longitud: number;
  label: string;
}
