import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import * as fromAuth from './../../../root-store/authentication/authentication.reducer';

@Injectable({
  providedIn: 'root',
})
export class AuthenticatedGuard implements CanActivate {
  constructor(private store: Store<fromAuth.IState>, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.store.select(fromAuth.selectIsLoggedIn)
      .pipe(
        tap((logged) => {
          if (!logged) {
            this.router.navigate(['/login'], {
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
  constructor(private store: Store<fromAuth.IState>, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.store.select(fromAuth.selectIsLoggedIn)
      .pipe(
        map((logged) => {
          if (logged) {
            this.router.navigate(['/home']);
          }
          return !logged;
        }),
      );
  }
}
