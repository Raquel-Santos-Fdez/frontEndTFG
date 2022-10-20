import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  employee:any={};
  imagenes:string[]=["assets/img/imagen1.jpg", "assets/img/imagen2.jpg", "assets/img/imagen3.Ajpg"];
  rutaImagen:string=this.imagenes[0];
  actual:number=0;
  imageObject=[{
    image:'assets/img/imagen1.jpg',
    thumbImage: 'assets/img/imagen1.jpg',
    alt:'imagen1'
  },{
    image:'assets/img/imagen2.jpg',
    thumbImage: 'assets/img/imagen2.jpg',
    alt:'imagen2'
  },{
    mage:'assets/img/imagen3.jpg',
    thumbImage: 'assets/img/imagen3.jpg',
    alt:'imagen3'
  }];

  constructor() { }

  ngOnInit(): void {
    this.employee = JSON.parse(localStorage.getItem("usuario")||'{}');

    if(!this.employee)
      location.href="/";

  }

  cambiaDerecha() {
    if(this.actual!=this.imagenes.length-1) {
      this.rutaImagen = this.imagenes[this.actual + 1];
      this.actual += 1;
    }
  }

  cambiaIzquierda() {
    if(this.actual!=0) {
      this.rutaImagen = this.imagenes[this.actual - 1];
      this.actual -= 1;
    }
  }
}
