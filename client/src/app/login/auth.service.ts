/**
 * Created by ena3 on 12/20/17.
 */
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import {Http, Headers} from '@angular/http';
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

    this.http.post('api/login',{username:username,password:password},{ observe: 'response' }).subscribe(data => {
      console.log(data);
      let token = data.headers.get('Authorization');
      console.log(token);

      localStorage.setItem('currentUser', token );

      this.isLoggedIn.next(true);

        console.log(this.redirectUrl);
    });
    return this.isLoggedIn;

  }


  logout(): void {
    localStorage.removeItem('currentUser');

    this.isLoggedIn.next(false);
  }
}

