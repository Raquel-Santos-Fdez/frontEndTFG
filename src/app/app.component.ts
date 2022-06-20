import {Component, HostListener, OnInit} from '@angular/core';
import {finalize} from "rxjs";


@Component({
  selector: 'app-root', //etiqueta que vamos a usar en el html
  templateUrl: './app.component.html', //indica que vista esta asociada al componente
  styleUrls: ['./app.component.css'] //indica las hojas de estilo del componente
})
export class AppComponent { //clase que exportamos para poder importarla en otros componentes


  constructor() {
    // localStorage.removeItem("usuario");
  }

  ngOnInit(): void {

  }

  // @HostListener('window:beforeunload', ['$event'])
  // beforeunloadHandler(event:any) {
  //   localStorage.clear();
  //
  // }

}
