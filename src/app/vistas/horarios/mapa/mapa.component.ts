import { Component, OnInit } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { map } from 'rxjs';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

  //Markers: Zonas de trabajo
  marker: Marker | undefined;
  markers: any[] = [];

  //Map options
  center: { lat: number; lng: number; } | undefined ;
  options: google.maps.MapOptions = {
    mapTypeId: 'satellite',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    maxZoom: 17,
    minZoom: 5,
  };

  constructor() {
    this.center = { lat: 43.553292, lng: -5.86437 };
  }

  ngOnInit(): void {
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
    this.addMarker(
      43.267258,-5.805951

    )
  }

  private addMarker(
    latitude: number,
    longitude: number,
  ) {
    this.marker = {
      latitude: latitude,
      longitude: longitude,
      center: { lat: latitude, lng: longitude },
    };

    this.markers.push(this.marker);
  }

}

interface Marker {
  center: { lat: number; lng: number };
  latitude: number;
  longitude: number;
}
