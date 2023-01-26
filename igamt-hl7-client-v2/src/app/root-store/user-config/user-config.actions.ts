import { Message } from './../../modules/dam-framework/models/messages/message.class';
import { IUserConfig } from './../../modules/shared/models/config.class';
import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';

export enum UserConfigActionTypes {
  LoadUserConfig = '[Main Page] Load User Config',
  LoadUserConfigSuccess = '[Main Page] Load  User Config Success',
  LoadUserConfigFailure = '[Main Page] Load  User Config Failure',
  SaveUserConfig = '[Main Page] Save User Config Failure',
  SaveUserConfigSuccess = '[Main Page] Save User Config Success',
  SaveUserConfigFailure = '[Main Page] Save User Config Failure',

}

export class LoadUserConfig implements Action {
  readonly type = UserConfigActionTypes.LoadUserConfig;
}

export class SaveUserConfig implements Action {
  readonly type = UserConfigActionTypes.SaveUserConfig;
  constructor(readonly payload: IUserConfig) {
  }
}

export class LoadUserConfigSuccess implements Action {
  readonly type = UserConfigActionTypes.LoadUserConfigSuccess;

  constructor(readonly payload: Message<IUserConfig>) {
  }
}

export class LoadUserConfigFailure implements Action {
  readonly type = UserConfigActionTypes.LoadUserConfigFailure;

  constructor(readonly payload: HttpErrorResponse) {
  }
}

export class SaveUserConfigSuccess implements Action {
  readonly type = UserConfigActionTypes.SaveUserConfigSuccess;

  constructor(readonly payload: Message<IUserConfig>) {
  }
}

export class SaveUserConfigFailure implements Action {
  readonly type = UserConfigActionTypes.SaveUserConfigFailure;

  constructor(readonly payload: HttpErrorResponse) {
  }
}

export type UserConfigActions = LoadUserConfig | LoadUserConfigSuccess | LoadUserConfigFailure | SaveUserConfig | SaveUserConfigFailure | SaveUserConfigSuccess;
