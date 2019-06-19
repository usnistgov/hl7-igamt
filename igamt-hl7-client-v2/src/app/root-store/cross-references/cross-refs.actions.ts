import {HttpErrorResponse} from '@angular/common/http';
import { Action } from '@ngrx/store';
import {Message} from '../../modules/core/models/message/message.class';
import {Type} from '../../modules/shared/constants/type.enum';
import {IRelationShip} from '../../modules/shared/models/cross-reference';
import {IDisplayElement} from '../../modules/shared/models/display-element.interface';

export enum CrossRefsActionTypes {
  LoadCrossRefs = '[CrossRefs] Load CrossRefs',
  LoadCrossRefSuccess = '[CrossRefs] Load CrossRefs Success',
  LoadCrossRefsFailure = '[CrossRefs] Load CrossRefs Failure',
  ClearCrossRefs = '[CrossRefs] clear CrossRefs',
}

export class LoadCrossRefs implements Action {
  readonly type = CrossRefsActionTypes.LoadCrossRefs;
  constructor(readonly payload: {
      documentId: string;
      documentType: Type;
      elementType: Type;
      elementId: string;
  }) {
  }
}
export class LoadCrossRefsSuccess implements Action {
  readonly type = CrossRefsActionTypes.LoadCrossRefSuccess;
  constructor( readonly payload: Message<IRelationShip[]>) {
  }
}
export class LoadCrossRefsFailure implements Action {
  readonly type = CrossRefsActionTypes.LoadCrossRefsFailure;
  constructor(readonly payload: HttpErrorResponse) {
  }
}

export class ClearCrossRefs implements Action {
  readonly type = CrossRefsActionTypes.ClearCrossRefs;

}
export type CrossRefsActions = LoadCrossRefs | LoadCrossRefsSuccess | LoadCrossRefsFailure | ClearCrossRefs;
