import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Solicitud} from "../../../model/solicitud/solicitud";
import {JornadaService} from "../../../servicios/jornada.service";
import {SolicitudIntercambio} from "../../../model/solicitud/solicituIntercambio";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";

export interface DialogData {
}


@Component({
  selector: 'app-portal-solicitudes',
  templateUrl: './portal-solicitudes.component.html',
  styleUrls: ['./portal-solicitudes.component.css']
})
export class PortalSolicitudesComponent implements OnInit {

  animal: string;
  name: string;
  displayedColumns: string[] = ["fechaTrabajo", "fechaDescanso", "aceptar"];
  columnsMisSolicitudes: string[] = ["fechaTrabajo", "fechaDescanso", "estado"];
  todasSolicitudes: SolicitudIntercambio[]
  misSolicitudes: SolicitudIntercambio[]

  constructor(public dialog: MatDialog, private service: JornadaService) {
  }

  ngOnInit(): void {
    this.loadSolicitudes();
    this.loadMisSolicitudes();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogNuevaSolicitud, {
      width: '500px',
      data: {name: this.name, animal: this.animal},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
    });
  }

  private loadSolicitudes() {
    let id: bigint = BigInt("1");
    this.service.findNotOwnSolicitudes(id).subscribe(data => {
      this.todasSolicitudes = data;
    });
  }

  private loadMisSolicitudes() {
    let id: bigint = BigInt("1");
    this.service.findOwnSolicitudes(id).subscribe(data => {
      this.misSolicitudes = data;
    });
  }

   aceptarSolicitud(solicitud:SolicitudIntercambio) {
    let id: bigint = BigInt("1");
    let posible=setTimeout(()=>{this.service.checkCambioJornada(id,solicitud.fecha, solicitud.fechaDescanso)},500);
    if (!posible)
      alert("No es posible realizar el cambio de turno, por favor consulta tu jornada")
    else {
      this.service.reasignar(solicitud).subscribe();
      this.todasSolicitudes=this.todasSolicitudes.filter(s=> s!=solicitud)
    }


  }
}

@Component({
  selector: 'dialog-nueva-solicitud',
  templateUrl: './dialog-nueva-solicitud.html',
  styleUrls: ['./portal-solicitudes.component.css']
})
export class DialogNuevaSolicitud {
  constructor(
    public dialogRef: MatDialogRef<DialogNuevaSolicitud>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private service: JornadaService
  ) {
  }

  selected: string;
  solicitud: SolicitudIntercambio = new SolicitudIntercambio()

  onNoClick(): void {
    this.dialogRef.close();
  }

  enviar() {
    this.solicitud.motivo = this.selected;
    if (this.solicitud.motivo != undefined && this.solicitud.fechaDescanso != undefined && this.solicitud.fecha != undefined)
      this.service.addSolicitudIntercambio(this.solicitud).subscribe();
    this.dialogRef.close();
  }

  saveDateLibrar(event: MatDatepickerInputEvent<Date>) {
    this.solicitud.fecha = new Date(`${event.value}`).toISOString().split('T')[0];
  }

  saveDateCubrir(event: MatDatepickerInputEvent<Date>) {
    this.solicitud.fechaDescanso = new Date(`${event.value}`).toISOString().split('T')[0];
  }
}
