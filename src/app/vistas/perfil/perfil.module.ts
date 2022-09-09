import { NgModule } from '@angular/core';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {PasswordDialog} from "./perfil.component";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";


@NgModule({
  declarations: [
    PasswordDialog

],
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule

  ],
  providers: [

  {
    provide: MatDialogRef,
    useValue: {}
  },
    {
      provide: MAT_DIALOG_DATA,
      useValue: {}
    }
  ],
})
export class PerfilModule { }
