import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, flatMap, map, mergeMap } from 'rxjs/operators';
import { Message, UserMessage } from 'src/app/modules/core/models/message/message.class';
import { RxjsStoreHelperService } from 'src/app/modules/shared/services/rxjs-store-helper.service';
import { MessageType } from '../../modules/core/models/message/message.class';
import { MessageService } from '../../modules/core/services/message.service';
import { TurnOffLoader, TurnOnLoader } from '../loader/loader.actions';
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
  UpdatePasswordRequest,
  UpdatePasswordRequestFailure,
  UpdatePasswordRequestSuccess,
} from './authentication.actions';

@Injectable()
export class AuthenticationEffects {

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

  @Effect()
  unauthorizedRequest$ = this.actions$.pipe(
    ofType(AuthenticationActionTypes.UnauthorizedRequest),
    flatMap(() => {
      this.router.navigate(['/home']);
      return [
        new TurnOffLoader(),
        this.message.userMessageToAction(new UserMessage(MessageType.WARNING, 'Session timed out')),
        new UpdateAuthStatus({
          userInfo: null,
          isLoggedIn: false,
        })];
    }),
  );

  // Triggered when the logout is successful
  @Effect()
  logoutSuccess$ = this.actions$.pipe(
    ofType(AuthenticationActionTypes.LogoutSuccess),
    map(() => {
      this.router.navigate(['/home']);
      return new UpdateAuthStatus({
        userInfo: null,
        isLoggedIn: false,
      });
    }),
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

  // ---------------- LOGIN SUCCESS/FAILURE ----------------
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

  // ---------------- UPDATE PASSWORD SUCCESS/FAILURE ----------------
  @Effect()
  updatePasswordRequestSuccess$ = this.actions$.pipe(
    ofType(AuthenticationActionTypes.UpdatePasswordRequestSuccess),
    this.helper.finalize<UpdatePasswordRequestSuccess, Message>({
      clearMessages: true,
      turnOffLoader: true,
      message: (action: UpdatePasswordRequestSuccess): Message => {
        return action.payload;
      },
      handler: (action: UpdatePasswordRequestSuccess): Action[] => {
        this.router.navigate(['/login']);
        return [];
      },
    }),
  );
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

  // ---------------- RESET PASSWORD SUCCESS/FAILURE ----------------
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

  constructor(
    private actions$: Actions<AuthenticationActions>,
    private store: Store<any>,
    private router: Router,
    private message: MessageService,
    private authService: AuthenticationService,
    private helper: RxjsStoreHelperService,
  ) {
  }

}
