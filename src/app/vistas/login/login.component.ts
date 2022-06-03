import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../servicios/authentication.service";
// import {AppService} from "../../app.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // error:boolean=false;
  // credentials = {username: '', password: ''};
  //
  // constructor(private app: AppService, private http: HttpClient, private router: Router) {
  // }
  //
  // login() {
  //   this.app.authenticate(this.credentials, () => {
  //     this.router.navigateByUrl('/');
  //   });
  //   return false;
  // }


  username:string;
  password: string;

  hide=true;

  constructor(private authentication:AuthenticationService, private router:Router) { }

  ngOnInit(): void {
  }

  login() {
    let resp=this.authentication.login(this.username, this.password);
    resp.subscribe(data=> {
        console.log("ESRO ES UNA PRUEBAAAAA");
          this.router.navigate(['/inicio']);
      }
    );
  }
}
