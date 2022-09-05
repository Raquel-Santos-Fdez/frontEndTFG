import {Component, Inject, OnInit} from '@angular/core';
import {Empleado, Rol} from "../../../model/empleado/empleado";
import {EmpleadosService} from "../../../servicios/empleados.service";
import {JornadaService} from "../../../servicios/jornada.service";
import {Tarea} from "../../../model/tarea/tarea";
import {Jornada} from "../../../model/jornada/jornada";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TrenService} from "../../../servicios/tren.service";
import {Estacion} from "../../../model/estacion/estacion";
import {EstacionService} from "../../../servicios/estacion.service";
import {DetallesEmpleadoComponent} from "../detalles-empleado.component";
import {DialogDetallesJornada} from "../consultar-jornada/consultar-jornada.component";
import {Situacion, Tarea_stop} from "../../../model/tarea/tarea_stop";
import {NuevaTareaDialog} from "./nueva-tarea.component";


@Component({
  selector: 'app-gest-usuarios-jornadas',
  templateUrl: './gest-usuarios-jornadas.component.html',
  styleUrls: ['./gest-usuarios-jornadas.component.css']
})
export class GestUsuariosJornadasComponent implements OnInit {

  empleados: Empleado[] = [];
  filtroUsuarios = '';
  diaSeleccionado: Date | null = null;
  tareasJornada: Tarea[] = [];
  hasTarea: boolean = false;
  empleadoSeleccionado: Empleado | undefined = undefined;
  jornadasEmpleado: Jornada[] = [];

  constructor(
    private empleadosService: EmpleadosService,
    private jornadaService: JornadaService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.mostrarUsuarios();

  }

  public mostrarUsuarios() {
    this.empleadosService.findAllEmpleados().subscribe(data => this.empleados = data)
  }

  seleccionarEmpleado(id: any) {
    this.tareasJornada = [];
    this.jornadasEmpleado = [];
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
    if (this.diaSeleccionado) {
      this.tareasJornada = [];
      this.jornadasEmpleado = [];
      //si hay un empelado seleccionado se muestrasn solo las de ese empleado, sino se muestran todas las de esa fecha
      if (this.empleadoSeleccionado) {
        this.jornadaService.findJornadaByDateEmpleado(this.diaSeleccionado, this.empleadoSeleccionado.id).subscribe(data => {
          this.jornadasEmpleado = data
          this.guardarTareas();
        });
      } else {
        console.log(new Date(this.diaSeleccionado))
        console.log(new Date(this.diaSeleccionado).toUTCString())
        this.jornadaService.findJornadaByDate(this.diaSeleccionado).subscribe(data => {
          this.jornadasEmpleado = data
          this.guardarTareas();
        });
      }
    }
  }

  public guardarTareas() {
    let i;
    for (i = 0; i < this.jornadasEmpleado.length; i++)
      this.jornadasEmpleado[i].tareas.forEach(l => this.tareasJornada.push(l))
    this.hasTarea = this.tareasJornada.length > 0;
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
            diaSeleccionado: this.diaSeleccionado,
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


// let tarea_stop: Tarea_stop = new Tarea_stop();
// this.jornadaService.addTareaStop(origen, "INICIO").subscribe(data => tarea_stop = data);
// this.jornadaService.assignTareaStop(tarea_stop.id, this.tarea).subscribe();
