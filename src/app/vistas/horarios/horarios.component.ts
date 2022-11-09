import {Component, OnInit} from '@angular/core';
import {Estacion} from "../../model/estacion/estacion";
import {Ruta} from "../../model/ruta/ruta";
import {Router} from "@angular/router";
import {ProveedorService} from "../../services/proveedor.service";
import {Route_stop} from "../../model/route_stop/route_stop";
import {RutaService} from "../../services/ruta.service";
import {EstacionService} from "../../services/estacion.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css']
})

export class HorariosComponent implements OnInit {

  rutas: Ruta[] = [];
  selected: Ruta;

  origen: Estacion;
  destino: Estacion;
  estaciones: Estacion[] = []
  isReady: boolean=false;

  constructor(private rutaService: RutaService,
              private paradaService: EstacionService,
              private router: Router,
              private proveedor: ProveedorService,
              private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {

    this.rutaService.findAllRoutes().subscribe(
      userData => {
        this.rutas = userData
      }
    );

    this.paradaService.findAllStops().subscribe(data => {
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
    let rutasConjuntas: Route_stop[] = [];
    this.isReady=false;
    if (origen && destino) {
      this.rutaService.findRutaByEstacion(origen.id, destino.id).subscribe(data => {
        rutasConjuntas = data;

        if (rutasConjuntas.length > 0) {
          this.proveedor.listRutas = rutasConjuntas;
          this.proveedor.origen = origen;
          this.isReady=true;
        } else
          alert("No existe recorrido entre esas dos estaciones");
      })

    } else {
      this._snackBar.open("Selecciona un origen y un destino", undefined, {duration: 2000});
    }
  }

  getAllEstaciones() {
    let estaciones: Estacion[] = []
    this.paradaService.findAllStops().subscribe(data => {
      estaciones = data
    });
    return estaciones;
  }
}
