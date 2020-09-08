import { Action } from '@ngrx/store';
import { IEditorMetadata } from '../../modules/dam-framework/models/data/workspace';
import { OpenEditorBase } from '../../modules/dam-framework/store/data/dam.actions';

export enum StructureEditorActionTypes {
  LoadUserStructures = '[StructureEditor] Load User Structures',
  LoadUserStructuresSuccess = '[StructureEditor] Load User Structures Success',
  LoadUserStructuresFailure = '[StructureEditor] Load User Structures Failure',

  LoadMessageStructure = '[StructureEditor] Load Message Structure',
  LoadMessageStructureSuccess = '[StructureEditor] Load Message Structure Success',
  LoadMessageStructureFailure = '[StructureEditor] Load Message Structure Failure',

  LoadSegmentStructure = '[StructureEditor] Load Segment Structure',
  LoadSegmentStructureSuccess = '[StructureEditor] Load Segment Structure Success',
  LoadSegmentStructureFailure = '[StructureEditor] Load Segment Structure Failure',

  OpenMessageStructureEditor = '[StructureEditor] Open Message Structure Editor',
  OpenMessageStructureMetadataEditor = '[StructureEditor] Open Message Structure Metadata Editor',

  OpenSegmentStructureEditor = '[StructureEditor] Open Segment Structure Editor',
  OpenSegmentStructureMetadataEditor = '[StructureEditor] Open Segment Structure Metadata Editor',

}

export class LoadUserStructures implements Action {
  readonly type = StructureEditorActionTypes.LoadUserStructures;
}

export class LoadUserStructuresSuccess implements Action {
  readonly type = StructureEditorActionTypes.LoadUserStructuresSuccess;
}

export class LoadUserStructuresFailure implements Action {
  readonly type = StructureEditorActionTypes.LoadUserStructuresFailure;
}

export class LoadMessageStructure implements Action {
  readonly type = StructureEditorActionTypes.LoadMessageStructure;
  constructor(readonly id: string) { }
}

export class LoadMessageStructureSuccess implements Action {
  readonly type = StructureEditorActionTypes.LoadMessageStructureSuccess;
}

export class LoadMessageStructureFailure implements Action {
  readonly type = StructureEditorActionTypes.LoadMessageStructureFailure;
}

export class LoadSegmentStructure implements Action {
  readonly type = StructureEditorActionTypes.LoadSegmentStructure;
  constructor(readonly id: string) { }
}

export class LoadSegmentStructureSuccess implements Action {
  readonly type = StructureEditorActionTypes.LoadSegmentStructureSuccess;
}

export class LoadSegmentStructureFailure implements Action {
  readonly type = StructureEditorActionTypes.LoadSegmentStructureFailure;
}

export class OpenMessageStructureEditor implements OpenEditorBase {
  readonly type = StructureEditorActionTypes.OpenMessageStructureEditor;

  constructor(readonly payload: { id: string, editor: IEditorMetadata }) { }
}

export class OpenMessageStructureMetadataEditor implements OpenEditorBase {
  readonly type = StructureEditorActionTypes.OpenMessageStructureMetadataEditor;

  constructor(readonly payload: { id: string, editor: IEditorMetadata }) { }
}

export class OpenSegmentStructureEditor implements OpenEditorBase {
  readonly type = StructureEditorActionTypes.OpenSegmentStructureEditor;

  constructor(readonly payload: { id: string, editor: IEditorMetadata }) { }
}

export class OpenSegmentStructureMetadataEditor implements OpenEditorBase {
  readonly type = StructureEditorActionTypes.OpenSegmentStructureMetadataEditor;

  constructor(readonly payload: { id: string, editor: IEditorMetadata }) { }
}

export type StructureEditorActions = LoadUserStructures
  | LoadUserStructuresSuccess
  | LoadUserStructuresFailure
  | LoadMessageStructure
  | LoadMessageStructureSuccess
  | LoadMessageStructureFailure
  | LoadSegmentStructure
  | LoadSegmentStructureSuccess
  | LoadSegmentStructureFailure
  | OpenMessageStructureEditor
  | OpenMessageStructureMetadataEditor
  | OpenSegmentStructureEditor
  | OpenSegmentStructureMetadataEditor;
