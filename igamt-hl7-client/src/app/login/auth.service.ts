/**
 * Created by ena3 on 12/20/17.
 */
import { Injectable } from '@angular/core';
import * as jwt_decode from "jwt-decode";

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";


@Injectable()
export class AuthService {
  //isLoggedIn = false;
  isLoggedIn:BehaviorSubject<boolean> =new BehaviorSubject<boolean>(false);

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  constructor(private  http :HttpClient){

  }

  login(username,password): BehaviorSubject<boolean> {
    console.log(username);
    this.http.post('/login',{username:username,password:password}, {observe:'response'}).subscribe(data => {
      console.log(data);
      let token = data.headers.get('Authorization');
      console.log(token);

      localStorage.setItem('currentUser', token );

      this.isLoggedIn.next(true);
      console.log(this.redirectUrl);
    }, error =>{

      this.isLoggedIn.next(false);

      }
    );
    return  this.isLoggedIn;

  }


  logout(): void {
    localStorage.removeItem('currentUser');

    this.isLoggedIn.next(false);
  }

  getcurrentUser() {
    var token = localStorage.getItem('currentUser');
    var tokenInfo=  this.getDecodedAccessToken(token);
    if(tokenInfo){
      return tokenInfo.sub;
    }else{
      return "Guest";
    }

  }

  getDecodedAccessToken(token: string): any {
    try{
      return jwt_decode(token);
    }
    catch(Error){
      return null;
    }

  }

  isAdmin(){
    var token = localStorage.getItem('currentUser');
    var tokenInfo=  this.getDecodedAccessToken(token);



  }

}

