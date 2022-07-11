import {Component, Inject, OnInit} from '@angular/core';
import {Employee} from "../../../model/employee/employee";
import {EmpleadosService} from "../../../servicios/empleados.service";
import {JornadaService} from "../../../servicios/jornada.service";
import {Tarea} from "../../../model/tarea/tarea";
import {Jornada} from "../../../model/jornada/jornada";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TrenService} from "../../../servicios/tren.service";
import {Stop} from "../../../model/stop/stop";
import {BackendService} from "../../../servicios/backend.service";
import {Situacion} from "../../../model/tarea/tarea_stop";
import {EstacionService} from "../../../servicios/parada.service";

export interface DialogData {

}

@Component({
  selector: 'app-gest-usuarios-jornadas',
  templateUrl: './gest-usuarios-jornadas.component.html',
  styleUrls: ['./gest-usuarios-jornadas.component.css']
})
export class GestUsuariosJornadasComponent implements OnInit {

  empleados: Employee[] = [];
  filtroUsuarios = '';
  diaSeleccionado: Date | null = null;
  tareas: Tarea[] = [];
  hasTarea: boolean = false;
  empleadoSeleccionado: Employee | undefined = undefined;
  jornadasEmpleado: Jornada[] = [];

  constructor(
    private empleadosService: EmpleadosService,
    private jornadaService: JornadaService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.empleadosService.findAllEmpleados().subscribe(data => this.empleados = data)
  }

  isClicado(id: any) {
    this.tareas = [];
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
      this.tareas = [];
      this.jornadasEmpleado = [];
      //si hay un empelado seleccionado se muestrasn solo las de ese empleado, sino se muestran todas las de esa fecha
      if (this.diaSeleccionado && this.empleadoSeleccionado) {
        this.jornadaService.findJornadaByDateEmpleado(this.diaSeleccionado, this.empleadoSeleccionado.id).subscribe(data => {
          this.jornadasEmpleado = data
          this.guardarTareas();
        });
      } else if (!this.diaSeleccionado && !this.empleadoSeleccionado) {
        this.jornadaService.findJornadaByDate(this.diaSeleccionado).subscribe(data => {
          this.jornadasEmpleado = data
          this.guardarTareas();
        });
      }
    }
  }

  private guardarTareas() {
    let i;
    for (i = 0; i < this.jornadasEmpleado.length; i++)
      this.jornadasEmpleado[i].tareas.forEach(l => this.tareas.push(l))
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
      this.isClicado(this.empleadoSeleccionado.id)
    else
      this.hasTarea = false;
  }

  addUsuario() {
    this.dialog.open(NuevoUsuarioDialog, {
      width: '450px',
      data: {}
    })
  }

  addTarea() {

    if (!this.diaSeleccionado || !this.empleadoSeleccionado)
      this._snackBar.open("Selecciona un día y un empleado", undefined, {duration: 2000});
    else {
      let jornada: Jornada
      this.jornadaService.findJornadaByDateEmpleado(this.diaSeleccionado, this.empleadoSeleccionado.id).subscribe(data => {
        jornada = data[0]
        if(!jornada && this.diaSeleccionado && this.empleadoSeleccionado) {
          jornada = new Jornada(this.diaSeleccionado, this.empleadoSeleccionado);
        }
        this.dialog.open(NuevaTareaDialog, {
          width: '450px',
          data: {
            jornada:jornada
          }
        })
      })

    }

  }
}

@Component({
  selector: 'nuevo-usuario',
  templateUrl: './nuevo-usuario.html',
  styleUrls: ['./gest-usuarios-jornadas.component.css']
})
export class NuevoUsuarioDialog {

  roles: string[] = ["Maquinista", "Revisor"];
  empleado: Employee = new Employee();

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
    private _snackBar: MatSnackBar
  ) {
  }

  addUsuarioNuevo() {
    if (this.formulario.valid) {
      this.employeeService.addEmployee(this.empleado).subscribe();
      this.dialogRef.close()
      this._snackBar.open("Usuario añadido correctamente", undefined, {duration: 2000});
    }
    //comprobar que todos los campos están rellenos
  }
}

export interface DialogData {
  jornada: Jornada
}

@Component({
  selector: 'nueva-tarea',
  templateUrl: './nueva-tarea.html',
  styleUrls: ['./gest-usuarios-jornadas.component.css']
})
export class NuevaTareaDialog {

  tarea: Tarea = new Tarea();
  time = {hour: 13, minute: 30};
  idTren: number;
  stops: Stop[] = []
  origen: Stop;
  destino: Stop;

  formulario = new FormGroup({
    anden: new FormControl('', [Validators.required, Validators.maxLength(2)]),
    descripcion: new FormControl('', [Validators.required]),
    horaInicio: new FormControl('', [Validators.required]),
    horaFin: new FormControl('', [Validators.required]),
    idTren: new FormControl('', [Validators.required])
  });

  constructor(
    public dialogRef: MatDialogRef<NuevaTareaDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private jornadaService: JornadaService,
    private trenService: TrenService,
    private paradaService: EstacionService,
    private _snackBar: MatSnackBar
  ) {
    this.paradaService.findAllStops().subscribe(data => {
      this.stops = data
    });
  }

  addNuevaTarea() {
    if (this.formulario.valid) {
      this.trenService.findTrenById(BigInt(this.idTren)).subscribe(data => {
        this.tarea.tren = data
      })
      this.tarea.jornada = this.data.jornada;
      this.jornadaService.addTarea(this.tarea).subscribe();
      console.log("TAREA: "+this.tarea)
      console.log("ORIGEN: "+this.origen)
      this.jornadaService.addTareaStop(this.tarea, this.origen, "INICIO").subscribe();
      // this.jornadaService.addTareaStop(this.tarea, this.origen, Situacion.FINAL).subscribe();
      this.dialogRef.close()
      this._snackBar.open("Tarea añadida correctamente", undefined, {duration: 2000});
    }
    //comprobar que todos los campos están rellenos
  }
}
