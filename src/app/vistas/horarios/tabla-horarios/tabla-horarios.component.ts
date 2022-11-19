import {Component, OnInit} from '@angular/core';
import {BackendService} from "../../../services/backend.service";
import {Horario} from "../../../model/horario/horario";
import {ProveedorService} from "../../../services/proveedor.service";

@Component({
  selector: 'app-tabla-horarios',
  templateUrl: './tabla-horarios.component.html',
  styleUrls: ['./tabla-horarios.component.css']
})
export class TablaHorariosComponent implements OnInit {

  stopTimes: Horario[] = [];
  displayedColumns: string[] = ["horario"];

  constructor(private service: BackendService, private proveedor: ProveedorService) {

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
    this.service.findHorarioByRutaEstacion(route_id, stop_id).subscribe(data => {
      this.stopTimes = data
    })

  }


}
