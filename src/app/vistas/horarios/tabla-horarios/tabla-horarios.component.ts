import {Component, OnInit} from '@angular/core';
import {Horario} from "../../../model/horario/horario";
import {ProveedorService} from "../../../services/proveedor.service";
import {RutaService} from "../../../services/ruta.service";

@Component({
  selector: 'app-tabla-horarios',
  templateUrl: './tabla-horarios.component.html',
  styleUrls: ['./tabla-horarios.component.css']
})
export class TablaHorariosComponent implements OnInit {

  stopTimes: Horario[] = [];
  displayedColumns: string[] = ["horario"];

  constructor(private rutaService: RutaService, private proveedor: ProveedorService) {

  }

  ngOnInit(): void {
    let rutasConjuntas = this.proveedor.listRutas;
    let origen = this.proveedor.origen;
    let i;
    for (i = 0; i < rutasConjuntas.length; i++) {
      this.addHorario(rutasConjuntas[i].ruta.ruta_id, origen.id)
    }


  }

  addHorario(route_id: string, stop_id: string) {
    this.rutaService.findHorarioByRutaEstacion(route_id, stop_id).subscribe(data => {
      this.stopTimes = data
    })

  }


}
