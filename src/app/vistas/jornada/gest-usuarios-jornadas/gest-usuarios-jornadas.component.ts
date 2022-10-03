import {Component, Inject, OnInit, SimpleChange} from '@angular/core';
import {Empleado, Rol} from "../../../model/empleado/empleado";
import {EmpleadosService} from "../../../servicios/empleados.service";
import {JornadaService} from "../../../servicios/jornada.service";
import {Tarea} from "../../../model/tarea/tarea";
import {Jornada} from "../../../model/jornada/jornada";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DetallesEmpleadoComponent} from "../detalles-empleado.component";
import {DialogDetallesJornada} from "../consultar-jornada/consultar-jornada.component";
import {Situacion} from "../../../model/tarea/tarea_stop";
import {NuevaTareaDialog} from "./nueva-tarea.component";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {DatePipe} from "@angular/common";


@Component({
  selector: 'app-gest-usuarios-jornadas',
  templateUrl: './gest-usuarios-jornadas.component.html',
  styleUrls: ['./gest-usuarios-jornadas.component.css']
})
export class GestUsuariosJornadasComponent implements OnInit {

  empleados: Empleado[] = [];
  filtroUsuarios = '';
  diaSeleccionado: Date | null = null;
  hasTarea: boolean = false;
  empleadoSeleccionado: Empleado | undefined = undefined;
  jornadasEmpleado: Jornada[] = [];

  tareas: {jornada:Jornada, tarea:Tarea}[]=[];
  displayedColumns: string[] = ['descripcion', 'fecha', 'horario', 'empleado','accion'];

  empleadoActual:Empleado;

  constructor(
    private empleadosService: EmpleadosService,
    private jornadaService: JornadaService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar) {

    this.empleadoActual=JSON.parse(localStorage.getItem("usuario") || '{}');

  }

  ngOnInit(): void {
    this.mostrarUsuarios();

  }

  public mostrarUsuarios() {
    this.empleadosService.findAllEmpleados().subscribe(data => {
      this.empleados = data
      this.empleados=this.empleados.filter(e=>e.id!=this.empleadoActual.id)
    })
  }

  seleccionarEmpleado(id: any) {
    this.tareas = [];
    this.jornadasEmpleado = [];
    this.empleadosService.findEmpleadoById(id).subscribe(data => {
      this.empleadoSeleccionado = data;
      if (this.diaSeleccionado == null)
        this.jornadaService.findJornadaByEmployee(this.empleadoSeleccionado.id).subscribe(data => {
          this.jornadasEmpleado = data;
          this.formatearFecha(this.jornadasEmpleado)
          this.guardarTareas();
        })
      else
        this.seleccionarDia()
    })
  }

  seleccionarDia() {
    if (this.diaSeleccionado) {
      this.tareas = [];
      this.jornadasEmpleado = [];
      //si hay un empelado seleccionado se muestrasn solo las de ese empleado, sino se muestran todas las de esa fecha
      if (this.empleadoSeleccionado) {
        this.jornadaService.findJornadaByDateEmpleado(this.diaSeleccionado, this.empleadoSeleccionado.id).subscribe(data => {
          this.jornadasEmpleado = data
          this.formatearFecha(this.jornadasEmpleado)
          this.guardarTareas();
        });
      } else {
        this.jornadaService.findJornadaByDate(this.diaSeleccionado).subscribe(data => {
          this.jornadasEmpleado = data
          this.formatearFecha(this.jornadasEmpleado)
          this.guardarTareas();
        });
      }
    }
  }

  private formatearFecha(jornadas:Jornada[]) {
    let pipe = new DatePipe('en-US')
    this.jornadasEmpleado.forEach(j=> {
      let fecha_seleccionada = pipe.transform(new Date(j.date), 'yyyy-MM-dd')
      if (fecha_seleccionada)
        j.date = fecha_seleccionada
    })


  }

   guardarTareas() {
    this.jornadasEmpleado.forEach(j=> j.tareas.forEach(t=>this.tareas.push({jornada:j,tarea:t})))
    this.hasTarea = this.tareas.length > 0;

  }

  deleteEmpleadoFiltro() {
    this.hasTarea = false;
    this.empleadoSeleccionado = undefined;
    if (this.diaSeleccionado)
      this.seleccionarDia()
  }

  deleteFechaFiltro() {
    this.diaSeleccionado = null;
    if (this.empleadoSeleccionado != null)
      this.seleccionarEmpleado(this.empleadoSeleccionado.id)
    else
      this.hasTarea = false;
  }

  addUsuario() {
    this.dialog.open(NuevoUsuarioDialog, {
      width: '450px',
      data: {gestorUsuariosJornadas: this}
    })
  }

  addTarea() {

    if (!this.diaSeleccionado || !this.empleadoSeleccionado)
      this._snackBar.open("Selecciona un día y un empleado", undefined, {duration: 2000});
    else {
      let jornada: Jornada
      this.jornadaService.findJornadaByDateEmpleado(this.diaSeleccionado, this.empleadoSeleccionado.id).subscribe(data => {
        jornada = data[0]
        this.dialog.open(NuevaTareaDialog, {
          width: '450px',
          data: {
            diaSeleccionado: this.diaSeleccionado?.toDateString(),
            empleadoSeleccionado: this.empleadoSeleccionado,
            jornada: jornada,
            gestorUsuariosJornadas: this
          }
        })
      })
    }
  }

  verDetallesEmpleado(empleado: Empleado) {
    this.dialog.open(DetallesEmpleadoComponent, {
      width: '450px',
      data: {
        empleado: empleado
      }
    })
  }

  verDetallesTarea(id: BigInt) {
    let tarea;
    this.jornadaService.findTareaById(id).subscribe(data => {
      tarea = data
      this.dialog.open(DialogDetallesJornada, {
        width: '450px',
        data: {
          tarea: tarea,
          origen: tarea.stops.forEach(s => s.situacion == Situacion.INICIO),
          final: tarea.stops.forEach(s => s.situacion == Situacion.FINAL),
          incidencias: tarea.tren.incidencias

        }
      })
    });


  }

  eliminarEmpleado(empleado: Empleado) {
    this.empleadosService.eliminarEmpleado(empleado).subscribe(() => {
      this.empleados = this.empleados.filter((e) => e.id != empleado.id)
      this.empleadoSeleccionado = undefined
    });

  }
}

export interface NuevoUsuarioData {
  gestorUsuariosJornadas: GestUsuariosJornadasComponent
}


@Component({
  selector: 'nuevo-usuario',
  templateUrl: './nuevo-usuario.html',
  styleUrls: ['./gest-usuarios-jornadas.component.css']
})
export class NuevoUsuarioDialog {

  roles: any[] = [];
  empleado: Empleado = new Empleado();
  rol: String;

  formulario = new FormGroup({
    username: new FormControl('', [Validators.required]),
    nombre: new FormControl('', [Validators.required]),
    apellidos: new FormControl('', [Validators.required]),
    dni: new FormControl('', [Validators.required, Validators.maxLength(9)]),
    email: new FormControl('', [Validators.required, Validators.email])
  });


  constructor(
    public dialogRef: MatDialogRef<NuevoUsuarioDialog>,
    private employeeService: EmpleadosService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: NuevoUsuarioData,
  ) {
    for (let item in Rol) {
      if (isNaN(Number(item)))
        this.roles.push({text: item, value: Rol[item]})
    }
  }

  addUsuarioNuevo() {
    if (this.formulario.valid) {
      //Generamos una contraseña aleatoria
      this.empleado.password = Math.random().toString(36).toUpperCase().slice(2)
      this.employeeService.addEmployee(this.empleado).subscribe(() =>
        this._snackBar.open("Usuario añadido correctamente", undefined, {duration: 2000})
      )
      ;
      this.dialogRef.close()

      setTimeout(() => this.data.gestorUsuariosJornadas.mostrarUsuarios(), 500);
    }
    //comprobar que todos los campos están rellenos
  }
}

