import {Component, OnInit} from '@angular/core';
import {Empleado} from "../../model/empleado/empleado";
import {EmpleadosService} from "../../services/empleados.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errorInicio: boolean = false;
  loading: boolean = false;
  employee:Empleado=new Empleado();
  show: boolean;

  constructor(private service: EmpleadosService) {
  }

  ngOnInit(): void {
  }

  login() {
    let formulario: any = document.getElementById("login");
    let formularioValido: boolean = formulario.reportValidity();
    if (formularioValido) {
      this.loading = true;
      this.service.login(this.employee).subscribe(data => {
        this.iniciarSesion(data)
      })
    }
  }

  iniciarSesion(resultado: any) {
    this.loading = false;
    if (resultado) {
      localStorage.setItem("usuario", JSON.stringify(resultado));
      location.href = "";
    } else {
      //si es null o undefined
      this.errorInicio = true;
    }
  }

  mostrarPassword() {
      this.show = !this.show;
  }
}
