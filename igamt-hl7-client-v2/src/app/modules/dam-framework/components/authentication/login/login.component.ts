import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IAuthenticationState } from '../../../models/authentication/state';
import { AuthenticationService } from '../../../services/authentication.service';
import * as fromAuth from '../../../store/authentication/index';
import { ClearAll } from '../../../store/messages/messages.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  goTo: string;

  constructor(
    private store: Store<IAuthenticationState>,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.goTo = this.authService.getLoginSuccessRedirectUrl();
  }

  authenticate(request: fromAuth.LoginRequest) {
    this.store.dispatch(new fromAuth.LoginPageRequest(request));
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
