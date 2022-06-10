import {Component, forwardRef, Inject, OnInit} from '@angular/core';
import {JornadaService} from "../../../servicios/jornada.service";
import {Tarea} from "../../../model/tarea/tarea";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Tarea_stop} from "../../../model/tarea/tarea_stop";
import {Stop} from "../../../model/stop/stop";

export interface DialogData {
  tarea: Tarea;
  origen: Stop
  final: Stop
}

@Component({
  selector: 'app-consultar-jornada',
  templateUrl: './consultar-jornada.component.html',
  styleUrls: ['./consultar-jornada.component.css']
})
export class ConsultarJornadaComponent implements OnInit {

  selected: Date | null;

  tareas: Tarea[] = [];
  tareaDetalle: Tarea = new Tarea();
  origen: Stop;
  final: Stop;

  isSelected: boolean = false;

  constructor(private service: JornadaService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  verJornada() {
    this.tareas = [];
    if (this.selected != null)
      this.service.findJornadaByDate(this.selected).subscribe(data => {
        this.tareas = data;
        if (this.tareas.length > 0)
          this.isSelected = true;
        else
          this.isSelected = false;
      });
  }


  verDetalles(id: bigint) {

    this.loadData(id);

    setTimeout(() => {
      this.dialog.open(DialogDetallesJornada, {
        width: '500px',
        data: {
          tarea: this.tareaDetalle,
          origen: this.origen,
          final: this.final
        }
      });
    }, 500)


  }

  private loadData(id: bigint) {
    let i;
    for (i = 0; i < this.tareas.length; i++)
      if (this.tareas[i].id == id)
        this.tareaDetalle = this.tareas[i];
    this.tareaDetalle.stops.forEach((s) => {
      let stop;
      this.service.findStopByTareaStop(s.id).subscribe(data => {
        stop = data;
        if (s.situacion == "INICIO")
          this.origen = stop;
        else
          this.final = stop;
      })
    })
  }
}

@Component({
  selector: 'dialog-detalles-jornada',
  templateUrl: './dialog-detalles-jornada.html',
  styleUrls: ['./consultar-jornada.component.css']
})
export class DialogDetallesJornada {
  constructor(
    public dialogRef: MatDialogRef<DialogDetallesJornada>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
  }
}
