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
import {Router} from "@angular/router";


@Injectable()
export class AuthService {
  //isLoggedIn = false;
  isLoggedIn:BehaviorSubject<boolean> =new BehaviorSubject<boolean>(false);

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  currentUser:BehaviorSubject<any> =new BehaviorSubject<any>(null);



  constructor(private  http :HttpClient, private router :Router){

  }

  login(username,password): BehaviorSubject<boolean> {
    console.log(username);
    this.http.post('api/login',{username:username,password:password}, {observe:'response'}).subscribe(data => {
      console.log(data);
      let token = data.headers.get('Authorization');
      console.log(token);
      this.currentUser.next(data);
      this.isLoggedIn.next(true);
      console.log(this.redirectUrl);
    }, error =>{

      this.isLoggedIn.next(false);

      }
    );
    return  this.isLoggedIn;

  }


  logout(): void {
    this.http.get('api/logout').toPromise().then( res =>{

      this.router.navigate(['/login']);
      this.currentUser.next(null);


    }, error=>{
      console.log("Failed to logout")

    })
  }

  getCurrentUser() {


    this.http.get('api/currentUser').toPromise().then( res =>{

      console.log(res);

      this.currentUser.next(res);

    }, error=>{
      console.log("error")
      this.currentUser.next("Hello Guest");
    })

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

