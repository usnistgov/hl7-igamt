import {HttpErrorResponse} from '@angular/common/http';
import {Action} from '@ngrx/store';
import {IGDisplayInfo} from '../../../modules/ig/models/ig/ig-document.class';
import {
  IAddNodes,
  ICopyNode,
  ICopyResourceResponse,
  IDeleteNode
} from '../../../modules/ig/models/toc/toc-operation.class';
import {IDisplayElement} from '../../../modules/shared/models/display-element.interface';

export enum IgEditActionTypes {
  IgEditResolverLoad = '[Ig Edit Resolver] Load Ig',
  IgEditResolverLoadSuccess = '[Ig Edit Resolver] Ig Load Success',
  IgEditResolverLoadFailure = '[Ig Edit Resolver] Ig Load Failure',
  UpdateSections = '[Ig Edit TOC] Update Sections',
  IgEditDeleteNode = '[Ig Edit TOC] Delete Node',
  IgEditTocAddResource = '[Ig Edit TOC] Add Resource',
  AddResourceSuccess = '[Ig Edit TOC] Add Resource Success',
  AddResourceFailure = '[Ig Edit TOC] Add Resource Failure',
  CopyResource = '[Ig Edit TOC] Copy Resource',
  CopyResourceSuccess = '[Ig Edit TOC] Copy Resource Success',
  CopyResourceFailure = '[Ig Edit TOC] Copy Resource Failure',
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

export class IgEditTocAddResource implements Action {
  readonly type = IgEditActionTypes.IgEditTocAddResource;
  constructor(readonly payload: IAddNodes) {
  }
}
export class AddResourceSuccess implements Action {
  readonly type = IgEditActionTypes.AddResourceSuccess;
  constructor(readonly payload: IGDisplayInfo) {
  }
}

export class AddResourceFailure implements Action {
  readonly type = IgEditActionTypes.AddResourceFailure;
  constructor(readonly error: HttpErrorResponse) {
  }
}

export class CopyResource implements Action {
  readonly type = IgEditActionTypes.CopyResource;
  constructor(readonly payload: ICopyNode) {
  }
}
export class CopyResourceSuccess implements Action {
  readonly type = IgEditActionTypes.CopyResourceSuccess;
  constructor(readonly payload: ICopyResourceResponse) {
  }
}

export class CopyResourceFailure implements Action {
  readonly type = IgEditActionTypes.CopyResourceFailure;
  constructor(readonly error: HttpErrorResponse) {
  }
}

export class IgEditDeleteNode implements Action {
  readonly type = IgEditActionTypes.IgEditDeleteNode;
  constructor(readonly payload: IDeleteNode) {
  }
}

export type IgEditActions =
  IgEditResolverLoad
  | IgEditResolverLoadSuccess
  | IgEditResolverLoadFailure
  | UpdateSections
  | IgEditTocAddResource
  | AddResourceSuccess
  | IgEditDeleteNode
  | CopyResource
  | CopyResourceSuccess
  | CopyResourceFailure;
