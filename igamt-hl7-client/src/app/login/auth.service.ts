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
import {MessageService} from "primeng/components/common/messageservice";


@Injectable()
export class AuthService {
  //isLoggedIn = false;
  isLoggedIn:BehaviorSubject<boolean> =new BehaviorSubject<boolean>(false);

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  currentUser:BehaviorSubject<any> =new BehaviorSubject<any>(null);



  constructor(private  http :HttpClient, private router :Router,private messageService: MessageService){

  }

  login(username,password): BehaviorSubject<boolean> {
    console.log(username);
    this.http.post('api/login',{username:username,password:password}, {observe:'response'}).subscribe(data => {
      console.log(data);
      let token = data.headers.get('Authorization');
      console.log(token);
      this.currentUser.next(data.body);
      this.isLoggedIn.next(true);
      console.log(this.redirectUrl);
    }, error =>{


      this.showError(error);

      this.isLoggedIn.next(false);

      }
    );
    return  this.isLoggedIn;

  }


  logout(): void {
    this.http.get('api/logout').toPromise().then( res =>{

      this.router.navigate(['/login']);
      this.currentUser.next(null);
      this.isLoggedIn.next(false);



    }, error=>{

      this.showError(error);


    })
  }

  getCurrentUser() {


    this.http.get('api/authentication').toPromise().then( res =>{

      console.log(res);

      this.currentUser.next(res);
      this.isLoggedIn.next(true);


    }, error=>{
      console.log("error");
      this.isLoggedIn.next(false);

      this.currentUser.next(null);
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


  isAuthenticated(){
    return this.isLoggedIn.getValue();
  }



  showError(error:any) {
    console.log(error);
    this.messageService.add({severity:'error', summary:error.error.error, detail:error.error.message, id:'LOGINERROR'});
  }



}

