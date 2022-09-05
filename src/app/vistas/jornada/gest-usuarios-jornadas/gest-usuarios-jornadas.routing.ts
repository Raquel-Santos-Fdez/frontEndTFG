import {Routes, RouterModule} from '@angular/router';
import {NgModule} from "@angular/core";
import {DetallesEmpleadoComponent} from "../detalles-empleado.component";

const routes:Routes =[

  {
    path:'detalles-empleado/:id',
    component: DetallesEmpleadoComponent
  }
];

@NgModule({
  imports:[RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class GestUsuariosJornadasRouting{}
