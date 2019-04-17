import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LoginPageRequest } from 'src/app/root-store/authentication/authentication.actions';
import { ClearAll } from 'src/app/root-store/page-messages/page-messages.actions';
import { LoginRequest } from './../../../../root-store/authentication/authentication.actions';
import * as fromAuth from './../../../../root-store/authentication/authentication.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  goTo: string;
  constructor(private store: Store<fromAuth.IState>, private router: Router, private route: ActivatedRoute) {
    this.goTo = 'home';
  }

  authenticate(request: LoginRequest) {
    this.store.dispatch(new LoginPageRequest(request));
  }

  ngOnInit() {
    this.store.dispatch(new ClearAll());
    this.route.queryParams.subscribe(
      (params) => {
        if (params['return']) {
          this.goTo = params['return'];
        }
      },
    );

    this.store.select(fromAuth.selectIsLoggedIn).subscribe(
      (isLogged) => {
        if (isLogged) {
          this.router.navigateByUrl(this.goTo);
        }
      },
    );
  }
}
