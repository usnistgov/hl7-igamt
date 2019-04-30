import {HttpErrorResponse} from '@angular/common/http';
import {Action} from '@ngrx/store';
import {IGDisplayInfo} from '../../../modules/ig/models/ig/ig-document.class';
import {IAddNodes, IDeleteNode} from '../../../modules/ig/models/toc/toc-operation.class';
import {IDisplayElement} from '../../../modules/shared/models/display-element.interface';
import { EditorID } from '../../../modules/shared/models/editor.enum';

export enum IgEditActionTypes {
  IgEditResolverLoad = '[Ig Edit Resolver] Load Ig',
  IgEditResolverLoadSuccess = '[Ig Edit Resolver] Ig Load Success',
  IgEditResolverLoadFailure = '[Ig Edit Resolver] Ig Load Failure',
  UpdateSections = '[Ig Edit TOC] Update Sections',
  IgEditTocAddNodes = '[Ig Edit TOC] Add Node',
  IgEditDeleteNode = '[Ig Edit TOC] Delete Node',
  OpenEditorNode = '[Ig Edit TOC] Open TOC Editor Node',
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

export class OpenEditorNode implements Action {
  readonly type = IgEditActionTypes.OpenEditorNode;

  constructor(readonly payload: {
    element: IDisplayElement,
    editor: EditorID,
  }) {
  }
}

export type IgEditActions =
  IgEditResolverLoad
  | IgEditResolverLoadSuccess
  | IgEditResolverLoadFailure
  | UpdateSections
  | IgEditTocAddNodes
  | IgEditDeleteNode
  | OpenEditorNode;
