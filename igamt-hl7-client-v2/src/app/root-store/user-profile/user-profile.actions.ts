import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import {IUserProfile} from '../../modules/dam-framework/models/authentication/user-profile.class';
import { User } from '../../modules/dam-framework/models/authentication/user.class';
import { Message } from '../../modules/dam-framework/models/messages/message.class';

export enum UserProfileActionTypes {
  UserProfileRequest = '[UserProfile Page] UserProfile Request',
  UserProfileSuccess = '[UserProfile Page] UserProfile Update Success',
  UserProfileFailure = '[UserProfile Page] UserProfile Update Failure',

}

export class UserProfileRequest implements Action {
  readonly type = UserProfileActionTypes.UserProfileRequest;

  constructor(readonly payload: IUserProfile) {
  }
}

export class UserProfileSuccess implements Action {
  readonly type = UserProfileActionTypes.UserProfileSuccess;

  constructor(readonly payload: Message<User>) {
  }
}

export class UserProfileFailure implements Action {
  readonly type = UserProfileActionTypes.UserProfileFailure;

  constructor(readonly payload: HttpErrorResponse) {
  }
}

export type UserProfileActions = UserProfileRequest | UserProfileFailure | UserProfileSuccess;
