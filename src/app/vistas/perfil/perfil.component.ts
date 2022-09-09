import {Component, Inject, OnInit} from '@angular/core';
import {Empleado} from "../../model/empleado/empleado";
import {EmpleadosService} from "../../servicios/empleados.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  empleado: Empleado;
  show: boolean;

  nuevaPassword: string = "";


  constructor(public passwordDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.empleado = JSON.parse(localStorage.getItem("usuario") || '{}');
    this.show = false;
  }

  mostrarPassword() {
    this.show = !this.show;
  }


  modificarPassword() {
    const dialogRef = this.passwordDialog.open(PasswordDialog, {
      width: '250px',
      data: {nuevaPassword: this.nuevaPassword, empleado: this.empleado},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.nuevaPassword = result;
    });
  }
}

export interface PasswordDialogData {
  nuevaPassword: string;
  repetirPassword: string;
  empleado: Empleado
}

@Component({
  selector: 'password-dialog',
  templateUrl: 'password-dialog.html',
})
export class PasswordDialog {
  constructor(
    public dialogRef: MatDialogRef<PasswordDialog>,
    @Inject(MAT_DIALOG_DATA) public data: PasswordDialogData,
    private empleadoService: EmpleadosService,
    private _snackBar: MatSnackBar
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  comprobarCoincidencia() {
    if (this.data.nuevaPassword == this.data.repetirPassword) {
      this.data.empleado.password = this.data.nuevaPassword;
      this.empleadoService.actualizarEmpleado(this.data.empleado).subscribe(() => {
          this.dialogRef.close()
          this._snackBar.open("Contraseña modificada correctamente", undefined, {duration: 2000})
        }
      )
    }


  }
}
