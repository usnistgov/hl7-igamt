import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { Message } from '../../modules/core/models/message/message.class';
import { User } from './../../modules/core/models/user/user.class';
import { IState } from './authentication.reducer';

export enum AuthenticationActionTypes {
  BootstrapCheckAuthStatus = '[Bootstrap Authentication] Check Authentication Status',
  LoginPageRequest = '[Login Page Authentication] Login Request',
  LoginSuccess = '[Authentication] Login Success',
  LoginFailure = '[Authentication] Login Failure',
  UnauthorizedRequest = '[Interceptor Authentication] Unauthorized Request',
  LogoutRequest = '[Logout Button Authentication] Logout Request',
  LogoutSuccess = '[Authentication] Logout Success',
  UpdateAuthStatus = '[Authentication] Update Authentication Status',
  ResetPasswordRequest = '[ResetPasswordRequest Page] Reset Password Request',
  ResetPasswordRequestSuccess = '[ResetPasswordRequest Page] Reset Password Request Sucess',
  ResetPasswordRequestFailure = '[ResetPasswordRequest Page] Reset Password Request Failure',
  ValidateToKen = '[New Password Page] Validate Authentication Token Request',
  ValidateToKenSuccess = '[New Password Page] Validate Authentication Token Request Success',
  ValidateToKenFailure = '[New Password Page] Validate Authentication Token Request Failure',
  UpdatePasswordRequest = '[New Password Page] Update Password  Request',
  UpdatePasswordRequestSuccess = '[New Password Page] Update Password  Request Success',
  UpdatePasswordRequestFailure = '[New Password Page] Update Password  Request Failure',
}

// [Bootstrap Authentication] Check Authentication Status, dispatched when bootstrapping the app to check the user's authentication status
export class BootstrapCheckAuthStatus implements Action {
  readonly type = AuthenticationActionTypes.BootstrapCheckAuthStatus;
}

export class LoginRequest {
  username: string;
  password: string;
}

// [Login Page Authentication] Login Request, dispatched when a User tries to login from the login page
export class LoginPageRequest implements Action {
  readonly type = AuthenticationActionTypes.LoginPageRequest;
  constructor(readonly payload: LoginRequest) { }
}

// [Authentication] Login Success, dispatched when Login was successful
export class LoginSuccess implements Action {
  readonly type = AuthenticationActionTypes.LoginSuccess;
  constructor(readonly payload: User) { }
}

// [Authentication] Login Failure, dispatched when login attempt has failed
export class LoginFailure implements Action {
  readonly type = AuthenticationActionTypes.LoginFailure;
  constructor(readonly error: HttpErrorResponse) { }
}

// [Interceptor Authentication] Unauthorized Request, dispatched when a request was unauthorized which means cookie token has expired'
export class UnauthorizedRequest implements Action {
  readonly type = AuthenticationActionTypes.UnauthorizedRequest;
  constructor(readonly error: HttpErrorResponse) { }
}

// [Logout Button Authentication] Logout Request, dispatched when the user click the Logout button
export class LogoutRequest implements Action {
  readonly type = AuthenticationActionTypes.LogoutRequest;
}

// [Authentication] dispatched when logout was successful
export class LogoutSuccess implements Action {
  readonly type = AuthenticationActionTypes.LogoutSuccess;
}

// [Authentication] Update Authentication Status, dispatched to update the User's authentication state
export class UpdateAuthStatus implements Action {
  readonly type = AuthenticationActionTypes.UpdateAuthStatus;
  constructor(readonly payload: IState) { }
}

export class ResetPasswordRequest implements Action {
  readonly type = AuthenticationActionTypes.ResetPasswordRequest;
  constructor(readonly payload: string) { }
}

export class ResetPasswordRequestSuccess implements Action {
  readonly type = AuthenticationActionTypes.ResetPasswordRequestSuccess;
  constructor(readonly payload: Message<string>) { }
}

export class ResetPasswordRequestFailure implements Action {
  readonly type = AuthenticationActionTypes.ResetPasswordRequestFailure;
  constructor(readonly payload: HttpErrorResponse) { }
}

export class ValidateToKen implements Action {
  readonly type = AuthenticationActionTypes.ValidateToKen;
  constructor(readonly payload: string) { }

}
export class ValidateToKenFailure implements Action {
  readonly type = AuthenticationActionTypes.ValidateToKenFailure;
}

export class ValidateToKenSuccess implements Action {
  readonly type = AuthenticationActionTypes.ValidateToKenSuccess;
}

export class UpdatePasswordRequest implements Action {
  readonly type = AuthenticationActionTypes.UpdatePasswordRequest;
  constructor(readonly payload: {
    token: string,
    password: string,
  }) { }
}

export class UpdatePasswordRequestSuccess implements Action {
  readonly type = AuthenticationActionTypes.UpdatePasswordRequestSuccess;
  constructor(readonly payload: Message<string>) { }

}

export class UpdatePasswordRequestFailure implements Action {
  readonly type = AuthenticationActionTypes.UpdatePasswordRequestFailure;
  constructor(readonly payload: HttpErrorResponse) { }
}

export type AuthenticationActions = BootstrapCheckAuthStatus | LoginPageRequest
  | LoginSuccess | LoginFailure | UnauthorizedRequest
  | LogoutRequest | LogoutSuccess | UpdateAuthStatus
  | ResetPasswordRequest | ResetPasswordRequestSuccess | ResetPasswordRequestFailure
  | ValidateToKen | ValidateToKenSuccess | ValidateToKenFailure
  | UpdatePasswordRequest | UpdatePasswordRequestSuccess | UpdatePasswordRequestFailure;
