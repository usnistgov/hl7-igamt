import {HttpErrorResponse} from '@angular/common/http';
import { Action } from '@ngrx/store';
import {Message} from '../../modules/core/models/message/message.class';
import {IResourceInfo} from '../../modules/shared/models/resource-info.interface';

export enum ResourceLoaderActionTypes {
  LoadResource = '[ResourceLoader] Load Resource',
  LoadResourceSuccess = '[ResourceLoader] Load Resource Success',
  LoadResourceFailure = '[ResourceLoader] Load Resource Failure',
  ClearResource = '[ClearResource] Clear Resource',
}

export class LoadResource implements Action {
  readonly type = ResourceLoaderActionTypes.LoadResource;
  constructor( readonly payload: IResourceInfo) {
  }
}
export class LoadResourceSuccess implements Action {
  readonly type = ResourceLoaderActionTypes.LoadResourceSuccess;
  constructor(readonly payload: {response:  Message<any[]>,  resourceInfo: IResourceInfo}) {
  }
}
export class LoadResourceFailure implements Action {
  readonly type = ResourceLoaderActionTypes.LoadResourceFailure;
  constructor(readonly payload: HttpErrorResponse) {
  }
}
export class ClearResource implements Action {
  readonly type = ResourceLoaderActionTypes.ClearResource;
  constructor() {
  }
}

export type ResourceLoaderActions = LoadResource| LoadResourceSuccess| LoadResourceFailure | ClearResource;
