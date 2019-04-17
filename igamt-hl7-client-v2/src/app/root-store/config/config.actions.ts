import {HttpErrorResponse} from '@angular/common/http';
import { Action } from '@ngrx/store';
import {Message} from '../../modules/core/models/message/message.class';
import {Hl7Config} from '../../modules/shared/models/config.class';

export enum ConfigActionTypes {
  LoadConfig = '[Main Page] Load Config',
  LoadConfigSuccess = '[Main Page] Load Config Success',
  LoadConfigFailure = '[Main Page] Load Config Failure',

}

export class LoadConfig implements Action {
  readonly type = ConfigActionTypes.LoadConfig;
}

export class LoadConfigSuccess implements Action {
  readonly type = ConfigActionTypes.LoadConfigSuccess;

  constructor(readonly payload: Message<Hl7Config>) {

  }
}

export class LoadConfigFailure implements Action {
  readonly type = ConfigActionTypes.LoadConfigFailure;
  constructor(readonly payload: HttpErrorResponse) {
  }
}

export type ConfigActions = LoadConfig | LoadConfigSuccess | LoadConfigFailure;
