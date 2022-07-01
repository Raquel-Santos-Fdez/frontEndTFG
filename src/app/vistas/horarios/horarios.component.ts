import {Component, NgModule, OnInit} from '@angular/core';
import {BackendService} from "../../servicios/backend.service";
import {Stop} from "../../model/stop/stop";
import {StopTime} from "../../model/stop_time/stop-time";
import {Route} from "../../model/route/route";
import {HorariosRouting} from "./horarios.routing";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl} from "@angular/forms";
import {ProveedorService} from "../../servicios/proveedor.service";
import {Route_stop} from "../../model/route_stop/route_stop";

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

  constructor(private service: BackendService, private router: Router, private proveedor: ProveedorService) {
  }

  ngOnInit(): void {

    this.service.findAllRoutes().subscribe(
      userData => {
        this.routes = userData
      }
    );

    this.service.findAllStops().subscribe(data => {
      this.stops = data
    });
  }

  getByShortName(shortName: string) {
    let estacionesEnRuta: Route[] = [];
    let i;
    for (i = 0; i < this.routes.length; i++) {
      if (this.routes[i].route_short_name == shortName)
        estacionesEnRuta.push(this.routes[i])
    }
    return estacionesEnRuta;
  }

  getRoutes() {
    let lineas: Route[] = [];
    let j = 0;
    for (j = 0; j < this.routes.length; j++) {
      if (lineas.filter(l => l.route_short_name == this.routes[j].route_short_name).length == 0)
        lineas.push(this.routes[j])
    }
    return lineas;
  }

  // consultarHorario(origen: Stop, destino: Stop) {
  //   let rutasOrigen: Route[] = [];
  //   let rutasDestino: Route[] = [];
  //   let rutasConjuntas: Route[] = [];
  //   if (origen && destino) {
  //     this.service.findRoutesByStop(origen).subscribe(data => {
  //       rutasOrigen = data
  //       this.service.findRoutesByStop(destino).subscribe(data2 => {
  //           rutasDestino = data2
  //           let i;
  //           let j;
  //           for (i = 0; i < rutasOrigen.length; i++) {
  //             for (j = 0; j < rutasDestino.length; j++) {
  //               if (rutasOrigen[i].route_id == rutasDestino[j].route_id)
  //                 rutasConjuntas.push(rutasOrigen[i])
  //             }
  //           }
  //         if (rutasConjuntas.length > 0){
  //           this.proveedor.listRutas=rutasConjuntas;
  //           this.proveedor.origen=origen;
  //           this.router.navigate(['tabla_horarios']);
  //         }
  //
  //         else
  //           alert("No existe recorrido entre esas dos estaciones");
  //         }
  //       );
  //     });
  //
  //   }
  // }

  consultarHorario(origen: Stop, destino: Stop) {
    let rutasConjuntasOri: Route_stop[] = [];
    let rutasConjuntasDestino: Route_stop[] = [];
    let rutasConjuntas: Route_stop[] = [];
    if (origen && destino) {
      this.service.findRoutesByStops(origen.stop_id, destino.stop_id).subscribe(data => {
        rutasConjuntasOri = data
        this.service.findRoutesByStops(this.destino.stop_id, this.origen.stop_id).subscribe(data2 => {
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
    this.service.findAllStops().subscribe(data => {
      estaciones = data
    });
    return estaciones;
  }
}
