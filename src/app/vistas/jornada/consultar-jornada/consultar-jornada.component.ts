import {Component, Inject, OnInit} from '@angular/core';
import {JornadaService} from "../../../servicios/jornada.service";
import {Tarea} from "../../../model/tarea/tarea";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Stop} from "../../../model/stop/stop";
import {Incidencia} from "../../../model/incidencia/incidencia";
import {Employee} from "../../../model/employee/employee";
import {TrenService} from "../../../servicios/tren.service";
import {Situacion} from "../../../model/tarea/tarea_stop";

export interface DialogData {
  tarea: Tarea |undefined
  origen: Stop|undefined
  final: Stop|undefined
  incidencias: Incidencia[]
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
  origen: Stop|undefined;
  final: Stop |undefined;

  incidencias: Incidencia[]

  isSelected: boolean = false;

  employee:Employee;
  isLoggedIn:boolean=false;

  constructor(private service: JornadaService, private trenService: TrenService,public dialog: MatDialog) {

    // var employeeJson=JSON.parse(localStorage.string)
    // this.employee=service.find
  }

  ngOnInit(): void {
    this.employee=JSON.parse(localStorage.getItem("usuario")||'{}');
    if(Object.keys(this.employee).length!=0)
      this.isLoggedIn = true;
  }

  verJornada() {
    this.tareas = [];
    this.incidencias=[];
    this.origen=undefined;
    this.final=undefined;
    if (this.selected != null)
      this.service.findTareasByDateEmpleado(this.selected, this.employee.id).subscribe(data => {
        this.tareas = data
        if (this.tareas.length > 0)
          this.isSelected = true
        else
          this.isSelected = false
      });

  }


  verDetalles(id: bigint) {

    this.loadData(id);

    setTimeout(() => {
      this.dialog.open(DialogDetallesJornada, {
        width: '450px',
        data: {
          tarea: this.tareaDetalle,
          origen: this.origen,
          final: this.final,
          incidencias:this.incidencias
        }
      })
    }, 500)
  }

  private loadData(id: bigint) {
    let i
    for (i = 0; i < this.tareas.length; i++)
      if (this.tareas[i].id == id)
        this.tareaDetalle = this.tareas[i]
    this.tareaDetalle.stops.forEach((s) => {
      let stop
      this.service.findStopByTareaStop(s.id).subscribe(data => {
        stop = data;
        if (s.situacion == Situacion.INICIO)
          this.origen = stop
        else
          this.final = stop
      })
    })

    this.trenService.getIncidenciasPending(this.tareaDetalle.id).subscribe((data: Incidencia[])=>{
      this.incidencias=data;
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
    private service: JornadaService,
    private trenService: TrenService
  ) {
  }

  nuevaIncidencia:string="";


  addIncidencia() {
    //tarea puede ser undefined
    if(this.nuevaIncidencia!="" && this.data.tarea?.tren!=undefined){
      let incidencia=new Incidencia(this.nuevaIncidencia, this.data.tarea?.tren);
      this.trenService.addIncidencia(incidencia).subscribe()
      this.data.incidencias.push(incidencia);

    }
    // @ts-ignore
    document.getElementById("nuevasIncidencias").value="";

  }

  cerrar() {
    this.data.final=undefined
    this.data.origen=undefined
    this.data.tarea=undefined
    this.data.incidencias=[]
  }
}
