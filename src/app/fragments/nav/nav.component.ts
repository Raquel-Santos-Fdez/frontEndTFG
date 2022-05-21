
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatMenuTrigger} from "@angular/material/menu";

@Component({
  selector: 'nav-component',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  ///ponemos undefined porque sino hay que inicializarlo de alguna manera
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger | undefined;

  someMethod() {
    //util en caso de que sea undefined
    // @ts-ignore
    this.trigger.openMenu();
  }
}
