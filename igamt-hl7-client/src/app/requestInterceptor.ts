/**
 * Created by hnt5 on 12/3/17.
 */
import 'rxjs/add/operator/do';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {AuthService} from "./login/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor( private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).do((event: HttpEvent<any>) => {

    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401 || err.status === 403) {
          console.log("UNAUTHORIZED");
          
          this.router.navigate(['/login']);
        }
      }
    });
  }
}
