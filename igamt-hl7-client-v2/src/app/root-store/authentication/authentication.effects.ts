import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { _throw } from 'rxjs-compat/observable/throw';
import { catchError, concatMap, map, mergeMap } from 'rxjs/operators';
import { Message } from 'src/app/modules/core/models/message/message.class';
import { RxjsStoreHelperService } from 'src/app/modules/shared/services/rxjs-store-helper.service';
import { TurnOnLoader } from '../loader/loader.actions';
import { User } from './../../modules/core/models/user/user.class';
import { AuthenticationService } from './../../modules/core/services/authentication.service';
import {
  AuthenticationActions,
  AuthenticationActionTypes,
  BootstrapCheckAuthStatus,
  LoginFailure,
  LoginPageRequest,
  LoginSuccess,
  LogoutSuccess,
  ResetPasswordRequest,
  ResetPasswordRequestFailure,
  ResetPasswordRequestSuccess,
  UpdateAuthStatus,
  UpdatePasswordRequest, UpdatePasswordRequestFailure,
  UpdatePasswordRequestSuccess,
} from './authentication.actions';

@Injectable()
export class AuthenticationEffects {

  constructor(
    private actions$: Actions<AuthenticationActions>,
    private store: Store<any>,
    private authService: AuthenticationService,
    private helper: RxjsStoreHelperService,
  ) { }

  // Triggered when a login attempt is made
  @Effect()
  login$ = this.actions$.pipe(
    ofType(AuthenticationActionTypes.LoginPageRequest),
    concatMap((action: LoginPageRequest) => {
      this.store.dispatch(new TurnOnLoader({
        blockUI: false,
      }));
      return this.authService.login(action.payload.username, action.payload.password).pipe(
        map((message: Message<User>) => {
          return new LoginSuccess(message.data);
        }),
        catchError((error: HttpErrorResponse) => {
          return of(new LoginFailure(error));
        }),
      );
    }),
  );

  // Triggered when the application is bootstraped to check if user is already logged in (through Cookies)
  @Effect()
  checkAuthStatus$ = this.actions$.pipe(
    ofType(AuthenticationActionTypes.BootstrapCheckAuthStatus),
    mergeMap((action: BootstrapCheckAuthStatus) => {
      return this.authService.checkAuthStatus();
    }),
    map((user: User) => {
      return new UpdateAuthStatus({
        isLoggedIn: true,
        userInfo: user,
      });
    }),
    catchError((error: string) => {
      return of(new UpdateAuthStatus({
        isLoggedIn: false,
        userInfo: null,
      }));
    }),
  );

  // Triggered when the user requests a logout
  @Effect()
  logoutRequest$ = this.actions$.pipe(
    ofType(AuthenticationActionTypes.LogoutRequest),
    mergeMap(() => {
      return this.authService.logout();
    }),
    map(() => {
      return new LogoutSuccess();
    }),
  );

  // Triggered when the logout is successful
  @Effect()
  logoutSuccess$ = this.actions$.pipe(
    ofType(AuthenticationActionTypes.LogoutSuccess),
    map(() =>
      new UpdateAuthStatus({
        userInfo: null,
        isLoggedIn: false,
      }),
    ),
  );

  // Triggered when a reset password request is made
  @Effect()
  resetPasswordRequest$ = this.actions$.pipe(
    ofType(AuthenticationActionTypes.ResetPasswordRequest),
    concatMap((action: ResetPasswordRequest) => {
      this.store.dispatch(new TurnOnLoader({
        blockUI: true,
      }));
      return this.authService.requestChangePassword(action.payload).pipe(
        map((response: Message<string>) => {
          return new ResetPasswordRequestSuccess(response);
        }),
        catchError((error: HttpErrorResponse) => {
          return of(new ResetPasswordRequestFailure(error));
        }),
      );
    }),
  );

  // Triggered when a update password request is made
  @Effect()
  updatePasswordRequest$ = this.actions$.pipe(
    ofType(AuthenticationActionTypes.UpdatePasswordRequest),
    concatMap((action: UpdatePasswordRequest) => {
      this.store.dispatch(new TurnOnLoader({
        blockUI: true,
      }));
      return this.authService.updatePassword(action.payload.token, action.payload.password).pipe(
        map((response: Message<string>) => {
          return new UpdatePasswordRequestSuccess(response);
        }),
        catchError((error: HttpErrorResponse) => {
          return of(new UpdatePasswordRequestFailure(error));
        }),
      );
    }),
  );

  // ---------------- LOGIN SUCCESS/FAILURE ----------------

  @Effect()
  loginSuccess$ = this.actions$.pipe(
    ofType(AuthenticationActionTypes.LoginSuccess),
    this.helper.finalize<LoginSuccess>({
      clearMessages: true,
      turnOffLoader: true,
      handler: (action: LoginSuccess) => {
        return [
          new UpdateAuthStatus({
            userInfo: action.payload,
            isLoggedIn: true,
          }),
        ];
      },
    }),
  );

  @Effect()
  loginFailure$ = this.actions$.pipe(
    ofType(AuthenticationActionTypes.LoginFailure),
    this.helper.finalize<LoginFailure, HttpErrorResponse>({
      clearMessages: true,
      turnOffLoader: true,
      handler: (action: LoginFailure) => {
        return [
          new UpdateAuthStatus({
            userInfo: null,
            isLoggedIn: false,
          }),
        ];
      },
      message: (action: LoginFailure) => {
        return action.error;
      },
    }),
  );

  // ---------------- UPDATE PASSWORD SUCCESS/FAILURE ----------------

  @Effect()
  updatePasswordRequestFailure$ = this.actions$.pipe(
    ofType(AuthenticationActionTypes.UpdatePasswordRequestFailure),
    this.helper.finalize<UpdatePasswordRequestFailure, HttpErrorResponse>({
      clearMessages: true,
      turnOffLoader: true,
      message: (action: UpdatePasswordRequestFailure): HttpErrorResponse => {
        return action.payload;
      },
    }),
  );

  @Effect()
  updatePasswordRequestSuccess$ = this.actions$.pipe(
    ofType(AuthenticationActionTypes.UpdatePasswordRequestSuccess),
    this.helper.finalize<UpdatePasswordRequestSuccess, Message>({
      clearMessages: true,
      turnOffLoader: true,
      message: (action: UpdatePasswordRequestSuccess): Message => {
        return action.payload;
      },
    }),
  );

  // ---------------- RESET PASSWORD SUCCESS/FAILURE ----------------

  @Effect()
  resetPasswordRequestFailure$ = this.actions$.pipe(
    ofType(AuthenticationActionTypes.ResetPasswordRequestFailure),
    this.helper.finalize<ResetPasswordRequestFailure, HttpErrorResponse>({
      clearMessages: true,
      turnOffLoader: true,
      message: (action: ResetPasswordRequestFailure): HttpErrorResponse => {
        return action.payload;
      },
    }),
  );

  @Effect()
  resetPasswordRequestSuccess$ = this.actions$.pipe(
    ofType(AuthenticationActionTypes.ResetPasswordRequestSuccess),
    this.helper.finalize<ResetPasswordRequestSuccess, Message>({
      clearMessages: true,
      turnOffLoader: true,
      message: (action: ResetPasswordRequestSuccess): Message => {
        return action.payload;
      },
    }),
  );

}
