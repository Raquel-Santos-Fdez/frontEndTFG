export class LoginObject {

  username:String;
  password:String;

  constructor(object:any){
    this.username=(object.username)? object.username:null;
    this.password=(object.password)? object.password:null;
  }
}
