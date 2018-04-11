/**
 * Created by ena3 on 12/20/17.
 */
import { Injectable } from '@angular/core';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import {HttpHeaders, HttpClient} from "@angular/common/http";
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

    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type':  'application/json'
    //   }),
    // {observe:'response'}
    // };

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
}

