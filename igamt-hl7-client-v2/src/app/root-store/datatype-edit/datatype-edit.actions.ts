import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { IDatatype } from '../../modules/shared/models/datatype.interface';
import { IEditorMetadata } from '../../modules/shared/models/editor.enum';

export enum DatatypeEditActionTypes {
  LoadDatatype = '[Datatype Edit] Load Datatype',
  LoadDatatypeSuccess = '[Datatype Edit] Load Datatype Success',
  LoadDatatypeFailure = '[Datatype Edit] Load Datatype Failure',
  OpenDatatypePreDefEditor = '[Datatype Edit] Open Datatype Editor',
  OpenDatatypePostDefEditor = '[Datatype Edit] Open Datatype PostDef Editor',
  OpenDatatypeMetadataEditorNode = '[Datatype Edit] Open Datatype Metadata Editor Node',
  OpenDatatypeStructureEditor = '[Datatype Edit] Open Datatype Structure Editor',
}

export class LoadDatatype implements Action {
  readonly type = DatatypeEditActionTypes.LoadDatatype;
  constructor(readonly id: string) { }
}

export class LoadDatatypeSuccess implements Action {
  readonly type = DatatypeEditActionTypes.LoadDatatypeSuccess;
  constructor(readonly Datatype: IDatatype) { }
}

export class LoadDatatypeFailure implements Action {
  readonly type = DatatypeEditActionTypes.LoadDatatypeFailure;
  constructor(readonly error: HttpErrorResponse) { }
}

export class OpenDatatypePreDefEditor implements Action {
  readonly type = DatatypeEditActionTypes.OpenDatatypePreDefEditor;
  constructor(readonly payload: {
    id: string,
    editor: IEditorMetadata,
  }) { }

}

export class OpenDatatypePostDefEditor implements Action {
  readonly type = DatatypeEditActionTypes.OpenDatatypePostDefEditor;
  constructor(readonly payload: {
    id: string,
    editor: IEditorMetadata,
  }) { }
}

export class OpenDatatypeStructureEditor implements Action {
  readonly type = DatatypeEditActionTypes.OpenDatatypeStructureEditor;
  constructor(readonly payload: {
    id: string,
    editor: IEditorMetadata,
  }) { }
}

export class OpenDatatypeMetadataEditorNode implements Action {
  readonly type = DatatypeEditActionTypes.OpenDatatypeMetadataEditorNode;
  constructor(readonly payload: {
    id: string,
    editor: IEditorMetadata,
  }) { }
}

export type DatatypeEditActions =
  LoadDatatype
  | LoadDatatypeSuccess
  | LoadDatatypeFailure
  | OpenDatatypePreDefEditor
  | OpenDatatypePostDefEditor
  | OpenDatatypeMetadataEditorNode;
