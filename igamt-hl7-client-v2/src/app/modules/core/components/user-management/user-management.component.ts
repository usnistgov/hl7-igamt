import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IAuthenticationState } from '../../../dam-framework/models/authentication/state';
import { IUserProfile } from '../../../dam-framework/models/authentication/user-profile.class';
import * as fromAuth from '../../../dam-framework/store/authentication';
import {ResetPasswordRequest} from '../../../dam-framework/store/authentication/authentication.actions';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  users: any[];
  constructor(private http: HttpClient, private store: Store<any>) {
    this.getAllUsers().subscribe((data) => {
      data.users.forEach((element) => {
        if (element.authorities.includes('ADMIN')) {
          element.admin = true;
        } else {
          element.admin = false;
        }
      });
      this.users = data.users;
    });
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any>('api/users');
  }

  rawChange(user: any): void {
    const requestPara: any = {};
    requestPara.username = user.username;
    requestPara.pending = user.pending;
    requestPara.admin = user.admin;
    console.log(requestPara);
    this.http.post<any>('api/adminUpdate', requestPara).subscribe((data) => {
      console.log(data);
    });
  }

  resetPassword(user: any): void {
    this.store.dispatch(new ResetPasswordRequest(user.username));
  }
  ngOnInit() {
  }
}
