import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/internal/operators/take';
import { flatMap } from 'rxjs/operators';
import { selectDocumentSessionId } from './../../../root-store/ig/ig-edit/ig-edit.selectors';

@Injectable()
export class DocumentSessionIdInterceptor implements HttpInterceptor {

  constructor(private store: Store<any>, private dialog: MatDialog) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select(selectDocumentSessionId).pipe(
      take(1),
      flatMap((value) => {
        const req = (value && request.method !== 'GET') ?
          request.clone({ setHeaders: { 'Document-Session-Id': value.uid } }) :
          request;

        return next.handle(req);
      }),
    );
  }

}
