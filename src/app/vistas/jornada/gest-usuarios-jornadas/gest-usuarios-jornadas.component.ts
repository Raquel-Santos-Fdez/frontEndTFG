import {Component, OnInit, ViewChild} from '@angular/core';
import {Empleado} from "../../../model/empleado/empleado";
import {EmpleadosService} from "../../../services/empleados.service";
import {JornadaService} from "../../../services/jornada.service";
import {Tarea} from "../../../model/tarea/tarea";
import {Jornada} from "../../../model/jornada/jornada";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DetallesEmpleadoComponent} from "../detalles-empleado.component";
import {DialogDetallesJornada} from "../consultar-jornada/consultar-jornada.component";
import {NuevaTareaDialog} from "./nueva-tarea.component";
import {DatePipe} from "@angular/common";
import {TrenService} from "../../../services/tren.service";
import {Estacion} from "../../../model/estacion/estacion";
import {Incidencia} from "../../../model/incidencia/incidencia";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {NuevoUsuarioDialog} from "./nuevo-usuario.component";


@Component({
  selector: 'app-gest-usuarios-jornadas',
  templateUrl: './gest-usuarios-jornadas.component.html',
  styleUrls: ['./gest-usuarios-jornadas.component.css']
})
export class GestUsuariosJornadasComponent implements OnInit {

  empleados: Empleado[] = [];
  filtroUsuarios = '';
  diaSeleccionado: any | null = null;
  hasTarea: boolean = false;
  empleadoSeleccionado: Empleado | undefined = undefined;
  jornadasEmpleado: Jornada[] = [];

  tareas: { jornada: Jornada, tarea: Tarea }[] = [];
  displayedColumns: string[] = ['descripcion', 'fecha', 'horario', 'empleado', 'accion'];

  empleadosColumn: string[] = ["username", "name", "rol", "accion"]

  empleadoActual: Empleado;
  isDiaLibre: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<{ jornada: Jornada, tarea: Tarea }>;
  isLoading:boolean=false;


  constructor(
    private empleadosService: EmpleadosService,
    private jornadaService: JornadaService,
    private trenService: TrenService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar) {

    this.empleadoActual = JSON.parse(localStorage.getItem("usuario") || '{}');

  }

  ngOnInit(): void {
    this.mostrarUsuarios();

    // @ts-ignore
    document.getElementById('paginador').style.display = 'none';
  }

  public mostrarUsuarios() {
    this.empleadosService.findAllEmpleados().subscribe(data => {
      this.empleados = data
      this.empleados = this.empleados.filter(e => e.id != this.empleadoActual.id)
      this.isLoading=false;
    })
  }

  seleccionarEmpleado(id: any) {
    this.inicializarParams();
    this.empleadosService.findEmpleadoById(id).subscribe(data => {
      this.empleadoSeleccionado = data;
      if (this.diaSeleccionado == null)
        this.jornadaService.findJornadaByEmployee(this.empleadoSeleccionado.id).subscribe(data => {
          this.jornadasEmpleado = data;
          this.guardarTareas();
        })
      else
        this.seleccionarDia()
    })
  }

  seleccionarDia() {
    console.log(this.diaSeleccionado)
    if (this.diaSeleccionado) {
      this.inicializarParams();
      //si hay un empleado seleccionado se muestrasn solo las de ese empleado, sino se muestran todas las de esa fecha
      if (this.empleadoSeleccionado) {
        this.jornadaService.findJornadaByDateEmpleado(this.diaSeleccionado.toDate(), this.empleadoSeleccionado.id).subscribe(data => {
          this.jornadasEmpleado = data;
          if (this.jornadasEmpleado.length > 0)
            if (this.jornadasEmpleado[0].diaLibre)
              this.isDiaLibre = true;
          this.guardarTareas();
        });
      } else {
        this.jornadaService.findJornadaByDate(this.diaSeleccionado.toDate()).subscribe(data => {
          this.jornadasEmpleado = data;
          this.guardarTareas();
        });
      }
    }
  }

  private inicializarParams() {
    this.tareas = [];
    this.jornadasEmpleado = [];
    this.hasTarea = false;
    this.isDiaLibre = false;
  }


  guardarTareas() {
    this.jornadasEmpleado.forEach(j => {
      j.tareas.forEach(t => this.tareas.push({jornada: j, tarea: t}))
    })
    this.paginarTareas(this.tareas)
    this.hasTarea = this.tareas.length > 0;

  }

  paginarTareas(tareas: any) {
    if (tareas.length > 0) {
      // @ts-ignore
      document.getElementById('paginador').style.display = 'block';
    }
    this.dataSource = new MatTableDataSource(tareas)
    this.dataSource.paginator = this.paginator;
  }

  deleteEmpleadoFiltro() {
    this.hasTarea = false;
    this.empleadoSeleccionado = undefined;
    if (this.diaSeleccionado)
      this.seleccionarDia()
    else {
      // @ts-ignore
      document.getElementById('paginador').style.display = 'none';
    }
  }

  deleteFechaFiltro() {
    this.diaSeleccionado = null;
    if (this.empleadoSeleccionado != null)
      this.seleccionarEmpleado(this.empleadoSeleccionado.id)
    else {
      this.hasTarea = false;
      // @ts-ignore
      document.getElementById('paginador').style.display = 'none';
    }
  }

  addUsuario() {
    this.dialog.open(NuevoUsuarioDialog, {
      width: '400px',
      data: {gestorUsuariosJornadas: this}
    })
  }

  addTarea() {

    if (!this.diaSeleccionado || !this.empleadoSeleccionado)
      this._snackBar.open("Selecciona un día y un empleado", undefined, {duration: 2000});
    else {
      if(this.isPosterior()) {
        let jornada: Jornada
        this.jornadaService.findJornadaByDateEmpleado(this.diaSeleccionado.toDate(), this.empleadoSeleccionado.id).subscribe(data => {
          jornada = data[0]
          this.dialog.open(NuevaTareaDialog, {
            width: '450px',
            data: {
              diaSeleccionado: this.diaSeleccionado.toDate(),
              empleadoSeleccionado: this.empleadoSeleccionado,
              jornada: jornada,
              gestorUsuariosJornadas: this
            }
          })
        })
      }else
        this._snackBar.open("La fecha debe ser posterior a la fecha actual", undefined, {duration: 2000});
    }
  }

  isPosterior(): boolean {
    let fecha_actual: Date = new Date();
    if (this.diaSeleccionado)
      return (fecha_actual <= this.diaSeleccionado.toDate());
    return false;

  }

  verDetallesEmpleado(empleado: Empleado) {
    this.dialog.open(DetallesEmpleadoComponent, {
      width: '450px',
      data: {
        empleado: empleado
      }
    })
  }

  verDetallesTarea(tarea: Tarea) {
    let incidencias: Incidencia[] = []
    let inicio: Estacion;
    let final: Estacion;
    this.jornadaService.findTareaById(tarea.id).subscribe(data => {
      tarea = data
      let j;
      for (j = 0; j < tarea.stops.length; j++) {
        if (tarea.stops[j].situacion.toString() == "INICIO")
          inicio = tarea.stops[j].estacion
        else
          final = tarea.stops[j].estacion
      }
      this.trenService.getIncidenciasPending(tarea.tren.id).subscribe(data => incidencias = data);
      this.dialog.open(DialogDetallesJornada, {
        width: '450px',
        data: {
          tarea: tarea,
          origen: inicio,
          final: final,
          incidencias: incidencias

        }
      })
    });


  }

  eliminarEmpleado(empleado: Empleado) {
    this.empleadosService.eliminarEmpleado(empleado).subscribe(() => {
      this.empleados = this.empleados.filter((e) => e.id != empleado.id)
      this.empleadoSeleccionado = undefined
      this.deleteEmpleadoFiltro();
      this._snackBar.open("El empleado se ha eliminado correctamente", undefined, {duration: 2000});
    });

  }

  formatearFecha(date: Date) {
    let pipe = new DatePipe('en-US')
    let fecha = pipe.transform(date, 'dd-MM-yyyy')
    if (fecha)
      return fecha;
    return ""

  }
}

export interface NuevoUsuarioData {
  gestorUsuariosJornadas: GestUsuariosJornadasComponent
}

