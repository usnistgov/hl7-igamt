import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { Type } from '../../modules/shared/constants/type.enum';
import { IResource } from '../../modules/shared/models/resource.interface';
export enum IgamtLoadedResourcesActionTypes {
  LoadResourceReferences = '[Resource References] Load Resource References',
  LoadResourceReferencesSuccess = '[Resource References] Load Resource References Success',
  LoadedResourceReferences = '[Resource References] Loaded Resource References',
  LoadResourceReferencesFailure = '[Resource References] Load Resource References Failure',
}

export class LoadResourceReferences implements Action {
  readonly type = IgamtLoadedResourcesActionTypes.LoadResourceReferences;

  constructor(readonly payload: {
    resourceType: Type,
    id: string,
    display?: boolean,
    insert?: boolean,
    tag?: string;
  }) {
  }
}

export class LoadResourceReferencesSuccess implements Action {
  readonly type = IgamtLoadedResourcesActionTypes.LoadResourceReferencesSuccess;

  constructor(readonly payload: IResource[], readonly ref: {
    resourceType: Type,
    id: string,
    tag?: string;
  }) {
  }
}

export class LoadResourceReferencesFailure implements Action {
  readonly type = IgamtLoadedResourcesActionTypes.LoadResourceReferencesFailure;

  constructor(readonly error: HttpErrorResponse) {
  }
}
export type IgamtLoadedResourcesActions = | LoadResourceReferences
  | LoadResourceReferencesSuccess
  | LoadResourceReferencesFailure
  ;
