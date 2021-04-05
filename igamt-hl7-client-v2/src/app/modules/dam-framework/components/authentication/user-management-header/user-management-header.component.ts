import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IAuthenticationState } from '../../../models/authentication/state';
import { LogoutRequest } from '../../../store/authentication/authentication.actions';
import * as fromAuth from '../../../store/authentication/index';

@Component({
  selector: 'app-user-management-header',
  templateUrl: './user-management-header.component.html',
  styleUrls: ['./user-management-header.component.scss'],
})
export class UserManagementHeaderComponent implements OnInit {

  loggedIn: Observable<boolean>;
  username: Observable<string>;
  isAdmin: Observable<boolean>;

  constructor(private store: Store<IAuthenticationState>, private router: Router) {
    this.isAdmin = store.select(fromAuth.selectIsAdmin);
    this.loggedIn = store.select(fromAuth.selectIsLoggedIn);
    this.username = store.select(fromAuth.selectUsername);
  }

  logout() {
    this.store.dispatch(new LogoutRequest());
  }

  userProfile() {
    this.router.navigateByUrl('user-profile');
  }

  userManagement() {
    this.router.navigateByUrl('user-management');
  }

  ngOnInit() {
  }

}
