import { Action } from '@ngrx/store';

export enum LibraryActionTypes {
  LoadLibrary = '[Library] Load Library',
  LoadLibrarySuccess = '[Library] Load Library Success',
  LoadLibraryFailure = '[Library] Load Library Failure',
}

export class LoadLibrary implements Action {
  readonly type = LibraryActionTypes.LoadLibrary;
  constructor(readonly id: string) { }
}

export class LoadLibrarySuccess implements Action {
  readonly type = LibraryActionTypes.LoadLibrarySuccess;
  constructor(library: any) { }
}

export class LoadLibraryFailure implements Action {
  readonly type = LibraryActionTypes.LoadLibraryFailure;
  constructor(error: string) { }
}

export type LibraryActions = LoadLibrary | LoadLibrarySuccess | LoadLibraryFailure;
