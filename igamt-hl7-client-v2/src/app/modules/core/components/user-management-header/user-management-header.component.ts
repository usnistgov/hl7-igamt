import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LogoutRequest } from 'src/app/root-store/authentication/authentication.actions';
import * as fromAuth from './../../../../root-store/authentication/authentication.reducer';

@Component({
  selector: 'app-user-management-header',
  templateUrl: './user-management-header.component.html',
  styleUrls: ['./user-management-header.component.scss'],
})
export class UserManagementHeaderComponent implements OnInit {

  loggedIn: Observable<boolean>;
  username: Observable<string>;

  constructor(private store: Store<fromAuth.IState>, private router: Router) {
    this.loggedIn = store.select(fromAuth.selectIsLoggedIn);
    this.username = store.select(fromAuth.selectUsername);
  }

  logout() {
    this.store.dispatch(new LogoutRequest());
  }

  ngOnInit() {
  }

}
