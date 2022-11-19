import {Component, Inject} from "@angular/core";
import {Empleado, Rol} from "../../../model/empleado/empleado";
import {AbstractControl, AsyncValidatorFn, FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {EmpleadosService} from "../../../services/empleados.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {map} from "rxjs/operators";
import {NuevoUsuarioData} from "./gest-usuarios-jornadas.component";

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
    username: new FormControl('', [Validators.required], this.validarUsername()),
    nombre: new FormControl('', [Validators.required]),
    apellidos: new FormControl('', [Validators.required]),
    dni: new FormControl('', [Validators.required, Validators.maxLength(9),
      Validators.minLength(9)], this.validarDni()),
    email: new FormControl('', [Validators.required, Validators.email], this.validarEmail()),
    rolEmpleado: new FormControl('', [Validators.required]),
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

  validarUsername(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return this.employeeService.findEmpleadoByUsername(control.value).pipe(
        map((result) => (result) ? {usernameExists: true} : null)
      );
    };
  }

  comprobarUsername(): boolean {
    return this.formulario.controls["username"].hasError("usernameExists");
  }

  validarDni(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return this.employeeService.findEmpleadoByDni(control.value).pipe(
        map((result) => (result) ? {dniExists: true} : null)
      );
    };
  }

  comprobarDni(): boolean {
    return this.formulario.controls["dni"].hasError("dniExists");
  }

  validarEmail(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return this.employeeService.findEmpleadoByEmail(control.value).pipe(
        map((result) => (result) ? {emailExists: true} : null)
      );
    };
  }

  comprobarEmail(): boolean {
    return this.formulario.controls["email"].hasError("emailExists");
  }


  addUsuarioNuevo() {
    if (this.formulario.valid) {
      //Generamos una contraseña aleatoria
      this.empleado.password = Math.random().toString(36).toUpperCase().slice(2)
      this.employeeService.addEmpleado(this.empleado).subscribe(() => {
          this.data.gestorUsuariosJornadas.isLoading = true;
          this.dialogRef.close()
          this._snackBar.open("Usuario añadido correctamente", undefined, {duration: 2000})
          this.data.gestorUsuariosJornadas.mostrarUsuarios();
        }
      );


    }
  }
}

