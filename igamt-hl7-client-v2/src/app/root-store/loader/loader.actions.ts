import { Action } from '@ngrx/store';

export enum LoaderActionTypes {
  TurnOnLoader = '[Loader] Start Loading',
  TurnOffLoader = '[Loader] Finish Loading',
}

export class TurnOnLoader implements Action {
  readonly type = LoaderActionTypes.TurnOnLoader;
  constructor(readonly payload: {
    blockUI: boolean,
  }) { }
}

export class TurnOffLoader implements Action {
  readonly type = LoaderActionTypes.TurnOffLoader;
  constructor() { }
}

export type LoaderActions = TurnOnLoader | TurnOffLoader;
