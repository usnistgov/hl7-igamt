import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {EMPTY, Observable, of, throwError} from 'rxjs';
import {catchError, concatMap, map} from 'rxjs/operators';
import {AuthenticationService} from '../services/authentication.service';

@Injectable()
export class NewPasswordResolver implements Resolve<any> {

  constructor(private authenticationService: AuthenticationService, private router: Router) {

  }

  resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Observable<any> {

     return this.authenticationService.validateToken(route.params['token']).pipe(
       catchError((err: any) => {
         this.router.navigate(['/error']);
         return throwError(err);
       }),
     );
  }

}
