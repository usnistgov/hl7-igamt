import {HttpErrorResponse} from '@angular/common/http';
import { Action } from '@ngrx/store';
import {
  DocumentationScope,
  DocumentationType,
  IDocumentation,
} from '../../modules/documentation/models/documentation.interface';
import {IEditorMetadata} from '../../modules/shared/models/editor.enum';
import {IgEditActionTypes} from '../document/document-edit/ig-edit.actions';

export enum DocumentationActionTypes {
  LoadDocumentations = '[Documentation] Load Documentations',
  LoadDocumentationsSuccess = '[Documentation] Load Success',
  LoadDocumentationsFailure = '[Documentation] Load Failure',
  OpenDocumentationSection = '[Documentation] Open Documentation Section',
  OpenDocumentationSectionSuccess = '[Documentation] Open Documentation Section Success',
  OpenDocumentationSectionFailure = '[Documentation] Open Documentation Section Failure',
  OpenDocumentationEditor = '[Documentation] Open Documentation Editor',
  DocumentationEditorChange = '[Documentation] Editor change',
  DocumentationEditorReset = '[Documentation]  Documentation Editor Reset',
  DocumentationEditorSaveSuccess = '[Documentation] Documentation Editor Save Success',
  DocumentationEditorUpdate = '[Documentation] Documentation Editor Update',
  DocumentationToolBarSave = '[Documentation] Documentation ToolBar Save',
  DocumentationEditorSaveFailure = '[Documentation] Documentation Editor Save Failure',
  UpdateDocumentationState = '[Documentation] Update Documentation State',
  DeleteDocumentationState = '[Documentation] Delete Documentation State',
  AddDocumentationState = '[Documentation] Add Documentation State',
  ToggleEditMode = '[Documentation] Documentation ToggleEditMode',
  UpdateDocumentationList = '[Documentation] Update Documentation List',
  UpdateDocumentationListSuccess = '[Documentation] Update Documentation List Success',
  UpdateDocumentationListFailure = '[Documentation] Update Documentation List Failure',
  DeleteDocument = '[Documentation] Delete Document',
  DeleteDocumentSuccess = '[Documentation] Delete Document Success',
  DeleteDocumentFailure = '[Documentation] Delete Document Failure',
  AddDocument = '[Documentation] Add Document',
  AddDocumentSuccess = '[Documentation] Add Document Success',
  AddDocumentFailure = '[Documentation] Add Document Failure',
}
export class LoadDocumentations implements Action {
  readonly type = DocumentationActionTypes.LoadDocumentations;
}

export class UpdateDocumentationState implements Action {
  readonly type = DocumentationActionTypes.UpdateDocumentationState;
  constructor(readonly payload: any) {
  }
}
export class ToggleEditMode implements Action {
  readonly type = DocumentationActionTypes.ToggleEditMode;
  constructor(readonly payload: boolean) {
  }
}
export class DeleteDocumentationState implements Action {
  readonly type = DocumentationActionTypes.DeleteDocumentationState;
  constructor(readonly id: string) {
  }
}
export class LoadDocumentationsSuccess implements Action {
  readonly type = DocumentationActionTypes.LoadDocumentationsSuccess;
  constructor(readonly payload: IDocumentation[]) {
  }
}

export class LoadDocumentationsFailure implements Action {
  readonly type = DocumentationActionTypes.LoadDocumentationsFailure;
  constructor(readonly error: HttpErrorResponse) { }
}

export class OpenDocumentationSection implements Action {
  readonly type = DocumentationActionTypes.OpenDocumentationSection;
  constructor(readonly payload: {
    id: string,
    editor: IEditorMetadata,
  }) {
  }
}

export class OpenDocumentationSectionSuccess implements Action {
  readonly type = DocumentationActionTypes.OpenDocumentationSectionSuccess;
  constructor(readonly payload: {
    id: string,
    editor: IEditorMetadata,
  }) {
  }
}

export class DocumentationEditorChange implements Action {
  readonly type = DocumentationActionTypes.DocumentationEditorChange;

  constructor(readonly payload: {
    data: any;
    valid: boolean;
    date: Date;
  }) {
  }
}
export class OpenDocumentationSectionFailure implements Action {
  readonly type = DocumentationActionTypes.OpenDocumentationSectionFailure;

  constructor(readonly payload: {
    id: string,
  }) {
  }
}

export class OpenDocumentationEditor implements Action {
  readonly type = DocumentationActionTypes.OpenDocumentationEditor;

  constructor(readonly payload: {
    id: string,
    element: IDocumentation,
    editor: IEditorMetadata,
    initial: any,
  }) {
  }
}

export class DocumentationToolBarSave implements Action {
  readonly type = DocumentationActionTypes.DocumentationToolBarSave;

  constructor() {
  }
}
export class AddDocumentationState implements Action {
  readonly type = DocumentationActionTypes.AddDocumentationState;
  constructor(readonly payload: IDocumentation) {
  }
}

export class DocumentationEditorSaveSuccess implements Action {
  readonly type = DocumentationActionTypes.DocumentationEditorSaveSuccess;
  constructor(readonly current?: any) {
  }
}

export class DocumentationEditorReset implements Action {
  readonly type = DocumentationActionTypes.DocumentationEditorReset;
  constructor(readonly current?: any) {
  }
}
export class DocumentationEditorSaveFailure implements Action {
  readonly type = DocumentationActionTypes.DocumentationEditorSaveFailure;
  constructor() {
  }
}

export class UpdateDocumentationList implements Action {
  readonly type = DocumentationActionTypes.UpdateDocumentationList;
  constructor(readonly list: IDocumentation[]) {
  }
}

export class UpdateDocumentationListSuccess implements Action {
  readonly type = DocumentationActionTypes.UpdateDocumentationListSuccess;
  constructor(readonly list: IDocumentation[]) {
  }
}

export class UpdateDocumentationListFailure implements Action {
  readonly type = DocumentationActionTypes.UpdateDocumentationListFailure;
  constructor(readonly list: IDocumentation[]) {
  }
}

export class DeleteDocument implements Action {
  readonly type = DocumentationActionTypes.DeleteDocument;
  constructor(readonly id: string, readonly list: IDocumentation[]) {
  }
}

export class DeleteDocumentSuccess implements Action {
  readonly type = DocumentationActionTypes.DeleteDocumentSuccess;
  constructor(readonly id: string, readonly list: IDocumentation[]) {
  }
}

export class DeleteDocumentFailure implements Action {
  readonly type = DocumentationActionTypes.DeleteDocumentFailure;
  constructor(readonly id: string, readonly list: IDocumentation[]) {
  }
}

export class AddDocument implements Action {
  readonly type = DocumentationActionTypes.AddDocument;
  constructor( readonly documentationType: DocumentationType, readonly index: number) {
  }
}
export class AddDocumentSuccess implements Action {
  readonly type = DocumentationActionTypes.AddDocumentSuccess;
  constructor( readonly documentation: IDocumentation) {
  }
}
export class AddDocumentFailure implements Action {
  readonly type = DocumentationActionTypes.AddDocumentFailure;
}

export type DocumentationsActions = LoadDocumentations| LoadDocumentationsSuccess |LoadDocumentationsFailure |
  OpenDocumentationSection  |OpenDocumentationSectionSuccess | OpenDocumentationSectionFailure |
  OpenDocumentationEditor | DocumentationEditorChange |DocumentationToolBarSave | DocumentationEditorSaveSuccess |
  DocumentationEditorReset | UpdateDocumentationState| DeleteDocumentationState | AddDocumentationState |
  ToggleEditMode | DocumentationEditorSaveFailure | UpdateDocumentationList |UpdateDocumentationListSuccess | UpdateDocumentationListFailure
  |DeleteDocument | DeleteDocumentSuccess | DeleteDocumentFailure;
