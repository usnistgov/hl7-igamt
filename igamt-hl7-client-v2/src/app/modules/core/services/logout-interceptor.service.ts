import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, flatMap, take } from 'rxjs/operators';
import { LoginFailure, LoginSuccess } from '../../../root-store/authentication/authentication.actions';
import { selectIsLoggedIn } from '../../../root-store/authentication/authentication.reducer';
import { AddMessage, ClearAll } from '../../../root-store/page-messages/page-messages.actions';
import { TimeoutLoginDialogComponent } from '../components/timeout-login-dialog/timeout-login-dialog.component';
import { MessageType, UserMessage } from '../models/message/message.class';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  readonly skipURL = [
    'api/authentication',
    'api/logout',
  ];

  constructor(
    public auth: AuthenticationService,
    private store: Store<any>,
    private http: HttpClient,
    public dialog: MatDialog) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (!this.skipURL.includes(request.url) && (err.status === 403 || err.status === 401)) {
          return this.store.select(selectIsLoggedIn).pipe(
            take(1),
            flatMap((loggedIn) => {
              this.store.dispatch(new ClearAll());
              if (loggedIn) {
                this.store.dispatch(new AddMessage(new UserMessage(MessageType.WARNING, 'Session Timed out')));
              } else {
                this.store.dispatch(new AddMessage(new UserMessage(MessageType.FAILED, 'Login Required')));
              }

              const dialogRef = this.dialog.open(TimeoutLoginDialogComponent);
              return dialogRef.afterClosed().pipe(
                flatMap((result) => {
                  if (result) {
                    return this.auth.login(result.username, result.password).pipe(
                      flatMap((message) => {
                        this.store.dispatch(new LoginSuccess(message.data));
                        return this.http.request<any>(request);
                      }),
                      catchError((error) => {
                        this.store.dispatch(new LoginFailure(error));
                        return this.http.request<any>(request);
                      }),
                    );
                  } else {
                    throwError(err);
                  }
                }),
              );
            }),
          );
        }
        return throwError(err);
      }),
    );
  }

}
