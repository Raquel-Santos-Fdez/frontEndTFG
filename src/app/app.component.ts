import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
// import {AppService} from "./app.service";
import {finalize} from "rxjs";


@Component({
  selector: 'app-root', //etiqueta que vamos a usar en el html
  templateUrl: './app.component.html', //indica que vista esta asociada al componente
  styleUrls: ['./app.component.css'] //indica las hojas de estilo del componente
})
export class AppComponent { //clase que exportamos para poder importarla en otros componentes


  constructor(
    // private app: AppService, private http:HttpClient, private router:Router
  ){
    // this.app.authenticate(undefined, undefined);
  }
  ngOnInit(): void {

  }

  logout() {
    // this.http.post('logout', {}).pipe(
    //   finalize(() => {
    //     this.app.authenticated = false;
    //     this.router.navigateByUrl('/login');
    //   })).subscribe();
  }
}
