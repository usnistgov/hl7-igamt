import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ResetPasswordRequest } from '../../../dam-framework/store/authentication/authentication.actions';

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
    this.http.post<any>('api/adminUpdate', requestPara).subscribe();
  }

  resetPassword(user: any): void {
    this.store.dispatch(new ResetPasswordRequest(user.username));
  }
  ngOnInit() {
  }
}
