import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable()
export class ResetPasswordService {

  constructor(private http: HttpClient) {


  }


  sendPasswordResetLink(email){

    return this.http.post('api/password/reset', email).toPromise();
  }

  validateToken(token){

    return this.http.post('api/password/validatetoken', token).toPromise();

  }
  confirmPasswordReset(obj){

    return this.http.post('api/password/reset/confirm', obj).toPromise();

  }
}
