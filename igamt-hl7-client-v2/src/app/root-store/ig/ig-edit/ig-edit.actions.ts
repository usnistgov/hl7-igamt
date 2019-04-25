import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import {IDisplayElement, IGDisplayInfo} from '../../../modules/ig/models/ig/ig-document.class';
import {IAddNodes, IDeleteNode} from '../../../modules/ig/models/toc/toc-operation.class';

export enum IgEditActionTypes {
  IgEditResolverLoad = '[Ig Edit Resolver] Load Ig',
  IgEditResolverLoadSuccess = '[Ig Edit Resolver] Ig Load Success',
  IgEditResolverLoadFailure = '[Ig Edit Resolver] Ig Load Failure',
  UpdateSections = '[Ig Edit TOC] Update Sections',
  IgEditTocAddNodes = '[Ig Edit TOC] Add Node',
  IgEditDeleteNode = '[Ig Edit TOC] Delete Node',
}

export class IgEditResolverLoad implements Action {
  readonly type = IgEditActionTypes.IgEditResolverLoad;
  constructor(readonly id: string) {
  }
}

export class IgEditResolverLoadSuccess implements Action {
  readonly type = IgEditActionTypes.IgEditResolverLoadSuccess;
  constructor(readonly igInfo: IGDisplayInfo) {
  }
}

export class IgEditResolverLoadFailure implements Action {
  readonly type = IgEditActionTypes.IgEditResolverLoadFailure;
  constructor(readonly error: HttpErrorResponse) {
  }
}

export class UpdateSections implements Action {
  readonly type = IgEditActionTypes.UpdateSections;
  constructor(readonly payload: IDisplayElement[]) {
  }
}

export class IgEditTocAddNodes implements Action {
  readonly type = IgEditActionTypes.IgEditTocAddNodes;
  constructor(readonly payload: IAddNodes) {
  }
}

export class IgEditDeleteNode implements Action {
  readonly type = IgEditActionTypes.IgEditDeleteNode;
  constructor(readonly payload: IDeleteNode) {
  }
}

export type IgEditActions = IgEditResolverLoad | IgEditResolverLoadSuccess | IgEditResolverLoadFailure |UpdateSections |IgEditTocAddNodes | IgEditDeleteNode;
