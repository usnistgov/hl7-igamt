import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IAuthenticationState } from '../models/authentication/state';
import { AuthenticationService } from '../services/authentication.service';
import * as fromAuth from '../store/authentication/index';

@Injectable({
  providedIn: 'root',
})
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private store: Store<IAuthenticationState>,
    private authService: AuthenticationService,
    private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.store.select(fromAuth.selectIsLoggedIn)
      .pipe(
        tap((logged) => {
          if (!logged) {
            this.router.navigate([this.authService.getLoginPageRedirectUrl()], {
              queryParams: {
                return: state.url,
              },
            });
          }
        }),
      );
  }
}
@Injectable({
  providedIn: 'root',
})
export class NotAuthenticatedGuard implements CanActivate {
  constructor(
    private store: Store<IAuthenticationState>,
    private authService: AuthenticationService,
    private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.store.select(fromAuth.selectIsLoggedIn)
      .pipe(
        map((logged) => {
          if (logged) {
            this.router.navigate([this.authService.getUnprotectedRedirectUrl()]);
          }
          return !logged;
        }),
      );
  }
}
