import {Component, OnInit} from '@angular/core';
import {Stop} from "../../model/stop/stop";
import {Route} from "../../model/route/route";
import {Router} from "@angular/router";
import {ProveedorService} from "../../servicios/proveedor.service";
import {Route_stop} from "../../model/route_stop/route_stop";
import {RutaService} from "../../servicios/ruta.service";
import {EstacionService} from "../../servicios/estacion.service";

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css']
})

export class HorariosComponent implements OnInit {

  routes: Route[] = [];
  selected: Route;

  origen: Stop;
  destino: Stop;
  stops: Stop[] = []

  constructor(private rutaService: RutaService,
              private paradaService: EstacionService,
              private router: Router,
              private proveedor: ProveedorService) {
  }

  ngOnInit(): void {

    this.rutaService.findAllRoutes().subscribe(
      userData => {
        this.routes = userData
      }
    );

    this.paradaService.findAllStops().subscribe(data => {
      this.stops = data
    });
  }

  // getByShortName(shortName: string) {
  //   let estacionesEnRuta: Route[] = [];
  //   let i;
  //   for (i = 0; i < this.routes.length; i++) {
  //     if (this.routes[i].route_short_name == shortName)
  //       estacionesEnRuta.push(this.routes[i])
  //   }
  //   return estacionesEnRuta;
  // }

  getRoutes() {
    let lineas: Route[] = [];
    let j = 0;
    for (j = 0; j < this.routes.length; j++) {
      if (lineas.filter(l => l.route_short_name == this.routes[j].route_short_name).length == 0)
        lineas.push(this.routes[j])
    }
    return lineas;
  }

  consultarHorario(origen: Stop, destino: Stop) {
    let rutasConjuntasOri: Route_stop[] = [];
    let rutasConjuntasDestino: Route_stop[] = [];
    let rutasConjuntas: Route_stop[] = [];
    if (origen && destino) {
      this.rutaService.findRutaByEstacion(origen.stop_id, destino.stop_id).subscribe(data => {
        rutasConjuntasOri = data
        this.rutaService.findRutaByEstacion(this.destino.stop_id, this.origen.stop_id).subscribe(data2 => {
          rutasConjuntasDestino = data2;
          let i;
          let j;
          for (i = 0; i < rutasConjuntasOri.length; i++) {
            for (j = 0; j < rutasConjuntasDestino.length; j++) {
              if (rutasConjuntasOri[i].orderParada < rutasConjuntasDestino[j].orderParada && rutasConjuntasOri[i].route == rutasConjuntasOri[j].route) {
                rutasConjuntas.push(rutasConjuntasOri[i])
              }
            }
          }

          if (rutasConjuntas.length > 0) {
            this.proveedor.listRutas = rutasConjuntas;
            this.proveedor.origen = origen;
            this.router.navigate(['tabla_horarios']);
          } else
            alert("No existe recorrido entre esas dos estaciones");

        })
      });

    }


  }

  getAllEstaciones() {
    let estaciones: Stop[] = []
    this.paradaService.findAllStops().subscribe(data => {
      estaciones = data
    });
    return estaciones;
  }
}
