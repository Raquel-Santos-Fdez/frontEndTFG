import {Component, OnInit} from '@angular/core';
import {Estacion} from "../../model/estacion/estacion";
import {Ruta} from "../../model/ruta/ruta";
import {Router} from "@angular/router";
import {ProveedorService} from "../../services/proveedor.service";
import {Route_stop} from "../../model/route_stop/route_stop";
import {RutaService} from "../../services/ruta.service";
import {EstacionService} from "../../services/estacion.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MapaComponent} from "./mapa/mapa.component";

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css'],
  providers:[MapaComponent]
})

export class HorariosComponent implements OnInit {

  rutas: Ruta[] = [];
  selected: Ruta;

  origen: Estacion;
  destino: Estacion;
  estaciones: Estacion[] = []
  isReady: boolean=false;
  existe:boolean=true;

  constructor(private rutaService: RutaService,
              private estacionService: EstacionService,
              private router: Router,
              private proveedor: ProveedorService,
              private _snackBar: MatSnackBar,
              private mapaComponent:MapaComponent) {
  }

  ngOnInit(): void {

    this.rutaService.findAllRoutes().subscribe(
      userData => {
        this.rutas = userData
      }
    );

    this.estacionService.findAllEstaciones().subscribe(data => {
      this.estaciones = data
    });
  }

  getRoutes() {
    let lineas: Ruta[] = [];
    let j = 0;
    for (j = 0; j < this.rutas.length; j++) {
      if (lineas.filter(l => l.ruta_corto == this.rutas[j].ruta_corto).length == 0)
        lineas.push(this.rutas[j])
    }
    return lineas;
  }

  consultarHorario(origen: Estacion, destino: Estacion) {
    this.existe=true
    let rutasConjuntas: Route_stop[] = [];
    this.isReady=false;
    if (origen && destino) {
      this.rutaService.findRutaByEstacion(origen.id, destino.id).subscribe(data => {
        rutasConjuntas = data;

        if (rutasConjuntas.length > 0) {
          this.proveedor.listRutas = rutasConjuntas;
          this.proveedor.origen = origen;
          this.isReady=true;
          this.mapaComponent.reload({lat:origen.latitud, lng:origen.longitud, nombre:origen.nombre},
            {lat:destino.latitud, lng:destino.longitud, nombre:destino.nombre});
        } else
          this.existe=false;
      })

    } else {
      this._snackBar.open("Selecciona un origen y un destino", undefined, {duration: 2000});
    }
  }

  getAllEstaciones() {
    let estaciones: Estacion[] = []
    this.estacionService.findAllEstaciones().subscribe(data => {
      estaciones = data
    });
    return estaciones;
  }
}
