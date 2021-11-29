import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { IRegistration } from '../../modules/dam-framework/models/authentication/registration.class';
import { User } from '../../modules/dam-framework/models/authentication/user.class';
import { Message } from '../../modules/dam-framework/models/messages/message.class';

export enum RegistrationActionTypes {
  RegistrationRequest = '[Registration Page] Registration Request',
  RegistrationSuccess = '[Registration Page] Registration Success',
  RegistrationFailure = '[Registration Page] Registration Failure',

}

export class RegistrationRequest implements Action {
  readonly type = RegistrationActionTypes.RegistrationRequest;

  constructor(readonly payload: IRegistration) {
  }
}

export class RegistrationSuccess implements Action {
  readonly type = RegistrationActionTypes.RegistrationSuccess;

  constructor(readonly payload: Message<User>) {
  }
}

export class RegistrationFailure implements Action {
  readonly type = RegistrationActionTypes.RegistrationFailure;

  constructor(readonly payload: HttpErrorResponse) {
  }
}

export type RegistrationActions = RegistrationRequest | RegistrationFailure | RegistrationSuccess;
