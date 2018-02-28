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

    var auth="Basic "+ btoa(username + ":" + password);
    let headers = new HttpHeaders(
      {
        'Authorization':auth,
        'Content-Type': 'application/json'
      }
    );
    this.http.get('api/accounts/login',{headers: headers}).subscribe(data => {
      return this.http.get('api/accounts/cuser').subscribe(user=>{
        this.isLoggedIn.next(true);

        console.log(this.redirectUrl);
      });
    });
    return this.isLoggedIn;

  }


  logout(): void {
    this.isLoggedIn.next(false);
  }
}

