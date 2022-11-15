import {Component, Inject, OnInit} from '@angular/core';
import {Empleado} from "../../model/empleado/empleado";
import {EmpleadosService} from "../../services/empleados.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormControl, FormGroup, Validators} from "@angular/forms";

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

  formularioPassword = new FormGroup({
      nuevaPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      repetirPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    },
    this.comprobarCoincidencia
  );

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

  comprobarCoincidencia(group: any) {
    if (group.controls.nuevaPassword.value != group.controls.repetirPassword.value) {
      return {passwordError: true};
    }
    return null;
  }


  actualizar() {
    if (this.formularioPassword.valid) {
      this.data.empleado.password = this.data.nuevaPassword;
      this.empleadoService.actualizarEmpleado(this.data.empleado).subscribe(() => {
          this.dialogRef.close()
          this._snackBar.open("Contraseña modificada correctamente", undefined, {duration: 2000})
        }
      )

    }
  }

  comprobarErrores() {
    return this.formularioPassword.hasError("passwordError");
  }
}
