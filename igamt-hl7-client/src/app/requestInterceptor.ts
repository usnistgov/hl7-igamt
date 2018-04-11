/**
 * Created by ena3 on 3/1/18.
 */
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("here");
    request = request.clone({
      // setHeaders: {
      //   Authorization: "Bearer"+localStorage.getItem('currentUser')
      // }
    });
    return next.handle(request);
  }
}
