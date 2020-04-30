import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, flatMap, take } from 'rxjs/operators';
import { TimeoutLoginDialogComponent } from '../components/authentication/timeout-login-dialog/timeout-login-dialog.component';
import { DAM_AUTH_CONFIG } from '../injection-token';
import { MessageType, UserMessage } from '../models/messages/message.class';
import { AuthenticationService, IAuthenticationURL } from '../services/authentication.service';
import { LoginFailure, LoginSuccess } from '../store/authentication/authentication.actions';
import * as fromAuth from '../store/authentication/index';
import { AddMessage, ClearAll } from '../store/messages/messages.actions';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private skipURL;

  constructor(
    @Inject(DAM_AUTH_CONFIG) private authConfig: IAuthenticationURL,
    public auth: AuthenticationService,
    private store: Store<any>,
    private http: HttpClient,
    public dialog: MatDialog) {
    this.skipURL = [
      authConfig.api.logout,
      authConfig.api.checkAuthStatus,
    ];
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (!this.skipURL.includes(request.url) && (err.status === 403 || err.status === 401)) {
          return this.store.select(fromAuth.selectIsLoggedIn).pipe(
            take(1),
            flatMap((loggedIn) => {
              this.store.dispatch(new ClearAll());
              if (loggedIn) {
                this.store.dispatch(new AddMessage(new UserMessage(MessageType.WARNING, 'Session Timed out')));
              } else {
                this.store.dispatch(new AddMessage(new UserMessage(MessageType.FAILED, 'Login Required')));
              }

              const dialogRef = this.dialog.open(TimeoutLoginDialogComponent, { disableClose: true });
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
