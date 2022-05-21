import { Component } from '@angular/core';


@Component({
  selector: 'app-root', //etiqueta que vamos a usar en el html
  templateUrl: './app.component.html', //indica que vista esta asociada al componente
  styleUrls: ['./app.component.css'] //indica las hojas de estilo del componente
})
export class AppComponent { //clase que exportamos para poder importarla en otros componentes

  options:string[]=["prueba", "prueba2"];
  constructor(){

  }


}
