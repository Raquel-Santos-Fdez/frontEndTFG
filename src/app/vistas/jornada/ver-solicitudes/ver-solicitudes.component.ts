import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MotivoAusencia, Solicitud} from "../../../model/solicitud/solicitud";
import {SolicitudVacaciones} from "../../../model/solicitud/solicitudVacaciones";
import {DatePipe} from "@angular/common";
import {SolicitudService} from "../../../services/solicitud.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Empleado} from "../../../model/empleado/empleado";
import {DetallesEmpleadoComponent} from "../detalles-empleado.component";
import {JornadaService} from "../../../services/jornada.service";
import {Jornada} from "../../../model/jornada/jornada";
import {Tarea} from "../../../model/tarea/tarea";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {SolFilter} from "./SolFilter";
import {MatSelectChange} from "@angular/material/select";
import {EmpleadosService} from "../../../services/empleados.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-ver-solicitudes',
  templateUrl: './ver-solicitudes.component.html',
  styleUrls: ['./ver-solicitudes.component.css']
})
export class VerSolicitudesComponent implements OnInit {

  solicitudes: Solicitud[] = [];
  displayedColumns: string[] = ["fecha", "motivo", "empleado", "accion"];
  diaSeleccionado: any | null = null;

  jornadasEmpleado: Jornada[] = [];
  tareas: { jornada: Jornada, tarea: Tarea }[] = [];
  hasTarea: boolean = false;
  columnasJornadas: string[] = ["fecha", "empleado"];
  empleadoActual: Empleado;

  solFilters: SolFilter[] = []
  filterDictionary = new Map<string, string>();
  dataSourceFilters = new MatTableDataSource(this.solicitudes);
  // dataSourceFilters:any;
  defaultValue = "Todos"
  motivos: string[] = [];
  usernames: string[] = [];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<Solicitud>;

  constructor(private solicitudService: SolicitudService, public dialog: MatDialog,
              private jornadaService: JornadaService,
              private empleadosService: EmpleadosService,
              private _snackBar: MatSnackBar) {

    this.empleadoActual = JSON.parse(localStorage.getItem("usuario") || '{}');

  }

  ngOnInit(): void {
    this.cargarSolicitudes();

    this.cargarMotivos();
    this.cargarUsernames();

    this.solFilters.push({name: 'motivo', options: this.motivos, defaultValue: this.defaultValue})
    this.solFilters.push({name: 'empleado', options: this.usernames, defaultValue: this.defaultValue})

  }

  cargarMotivos() {
    for (let item in MotivoAusencia) {
      if (isNaN(Number(item)))
        this.motivos.push(item)
    }
    this.motivos.push("Todos")
  }

  cargarUsernames() {
    let empleados: Empleado[] = []
    this.empleadosService.findAllEmpleados().subscribe(data => {
      empleados = data
      empleados = empleados.filter(e => e.id != this.empleadoActual.id)
      empleados.forEach(empleado => this.usernames.push(empleado.username))
      this.usernames.push("Todos")
    })
  }


  cargarSolicitudes() {
    this.solicitudService.getAllSolicitudesPendientes().subscribe(data => {
      this.solicitudes = data;

      this.dataSourceFilters = new MatTableDataSource(this.solicitudes);

      //filtramos las solicitudes
      //record --> solicitudes
      //filter --> filtros aplicados
      this.dataSourceFilters.filterPredicate = function (record: any, filter: any) {
        var map = new Map(JSON.parse(filter));
        let isMatch = false;
        for (let [key, value] of map) {
          //en caso de que se filtre por empleado cogemos el username
          if (key == 'empleado') {
            let record2 = record[key as keyof Solicitud].username;
            isMatch = (value == "Todos") || (record2 == value);
          } else {
            isMatch = (value == "Todos") || (record[key as keyof Solicitud] == value);
          }
          if (!isMatch) return false;
        }
        return isMatch;
      }

      this.paginarSolicitudes(this.dataSourceFilters.filteredData)
    });
  }

  paginarSolicitudes(solicitudes: any) {

    this.dataSource = new MatTableDataSource(solicitudes)
    this.dataSource.paginator = this.paginator;
  }

  aceptarSolicitud(solicitud: Solicitud) {
    if (solicitud.type == "solicitudVacaciones") {
      this.solicitudService.findSolicitudesVacacionesPendientes(solicitud.empleado.id).subscribe(data => {
        this.dialog.open(DialogSolVacaciones, {
          disableClose: true,
          width: '450px',
          data: {
            solicitudes: data,
            verSolicitudComp: this,
            accion: "aceptar"
          }
        })
      })
    } else {
      this.solicitudService.aceptarSolicitud(solicitud).subscribe(() => {
        this.cargarSolicitudes()
        this._snackBar.open("La solicitud ha sido aceptada", undefined, {duration: 2000});

      });
    }
  }

  rechazarSolicitud(solicitud: Solicitud) {
    if (solicitud.type == "solicitudVacaciones") {
      this.solicitudService.findSolicitudesVacacionesPendientes(solicitud.empleado.id).subscribe(data => {
        this.dialog.open(DialogSolVacaciones, {
          disableClose: true,
          width: '450px',
          data: {
            solicitudes: data,
            verSolicitudComp: this,
            accion: "rechazar"
          }
        })
      })
    } else {
      this.solicitudService.rechazarSolicitud(solicitud.id).subscribe(() => {
        this.cargarSolicitudes()
        this._snackBar.open("La solicitud ha sido rechazada", undefined, {duration: 2000});
      });
    }

  }

  getFinVacaciones(solicitud: Solicitud) {
    if (solicitud.type == "solicitudVacaciones") {
      let pipe = new DatePipe('en-US')
      let fecha = pipe.transform((solicitud as SolicitudVacaciones).fechaFinVacaciones, 'dd-MM-yyyy')
      return " -- " + fecha;
    }
    return "";
  }

  verDetallesEmpleado(empleado: Empleado) {
    this.dialog.open(DetallesEmpleadoComponent, {
      width: '450px',
      data: {
        empleado: empleado
      }
    })
  }

  seleccionarDia() {
    this.hasTarea = false;
    if (this.diaSeleccionado) {
      this.jornadaService.findJornadaByDate(this.diaSeleccionado.toDate()).subscribe(data => {
        this.jornadasEmpleado = data;
        if (this.jornadasEmpleado.length > 0)
          this.hasTarea = true;
      });
    }
  }

  formatearFecha(date: Date) {
    let pipe = new DatePipe('en-US')
    let fecha = pipe.transform(date, 'dd-MM-yyyy')
    if (fecha)
      return fecha;
    return ""

  }


  aplicarFiltro(ob: MatSelectChange, solfilter: SolFilter) {
    this.filterDictionary.set(solfilter.name, ob.value);


    var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));

    this.dataSourceFilters.filter = jsonString;

    this.paginarSolicitudes(this.dataSourceFilters.filteredData)
  }

  formatearFiltro(texto:string) {
    if(texto=="LICENCIA")
      return "Licencia";
    else if(texto=="OTRO_MOTIVO")
      return "Otro motivo";
    else if(texto=="FORMACION")
      return "Formación";
    else if(texto=="VISITA_MEDICA")
      return "Visita médica";
    else if(texto=="VACACIONES")
      return "Vacaciones";
    else
     return texto;
  }
}


export interface DialogData {
  solicitudes: SolicitudVacaciones[],
  verSolicitudComp: VerSolicitudesComponent,
  accion: String
}

@Component({
  selector: 'vacaciones-dialog',
  templateUrl: './vacaciones-dialog.html',
  styleUrls: ['./ver-solicitudes.component.css']
})
export class DialogSolVacaciones {

  periodo1: String;
  periodo2: String;
  empleado: Empleado;

  constructor(
    public dialogRef: MatDialogRef<DialogSolVacaciones>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private  solicitudService: SolicitudService
  ) {
    this.periodo1 = this.data.verSolicitudComp.formatearFecha(this.data.solicitudes[0].fecha)  + this.data.verSolicitudComp.getFinVacaciones(this.data.solicitudes[0])
    this.periodo2 = this.data.verSolicitudComp.formatearFecha(this.data.solicitudes[1].fecha)  + this.data.verSolicitudComp.getFinVacaciones(this.data.solicitudes[1])
    this.empleado = this.data.solicitudes[0].empleado;
  }

  aceptarVacaciones() {
    this.data.solicitudes.forEach(s => {
      this.solicitudService.aceptarSolicitud(s).subscribe(() => {
        this.data.verSolicitudComp.cargarSolicitudes();
        this.dialogRef.close();
      });
    })
  }

  rechazarVacaciones() {
    this.data.solicitudes.forEach(s => {
      this.solicitudService.rechazarSolicitud(s.id).subscribe(() => {
        this.data.verSolicitudComp.cargarSolicitudes();
        this.dialogRef.close();
      });
    })
  }
}
