import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { take } from 'rxjs/internal/operators/take';
import { catchError, flatMap } from 'rxjs/operators';
import { selectDocumentVersionSyncToken } from './../../../root-store/ig/ig-edit/ig-edit.selectors';
import { RefreshDialogComponent } from './../../shared/components/refresh-dialog/refresh-dialog.component';

@Injectable()
export class SyncEditInterceptor implements HttpInterceptor {

  constructor(private store: Store<any>, private dialog: MatDialog) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select(selectDocumentVersionSyncToken).pipe(
      take(1),
      flatMap((value) => {
        const req = (value && request.method !== 'GET') ?
          request.clone({ setHeaders: { 'Document-Sync-Version': value } }) :
          request;

        return next.handle(req).pipe(
          catchError((err) => {
            if (err.status && err.status === 490) {
              this.dialog.open(RefreshDialogComponent, {
                maxWidth: '600px',
                disableClose: true,
                data: {
                  message: err.error.text,
                  title: 'Document Out Of Synchronization',
                },
              });
            } else {
              return throwError(err);
            }
          }),
        );
      }),
    );
  }

}
