import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { ICompositeProfile } from '../../modules/shared/models/composite-profile';
import { IHL7EditorMetadata } from '../../modules/shared/models/editor.enum';
import { OpenEditorBase } from '../ig/ig-edit/ig-edit.actions';
import {SegmentEditActionTypes} from '../segment-edit/segment-edit.actions';

export enum CompositeProfileActionTypes {
  LoadCompositeProfile = '[CompositeProfile] Load CompositeProfile',
  LoadCompositeProfileSuccess = '[CompositeProfile] Load CompositeProfile Success',
  LoadCompositeProfileFailure = '[CompositeProfile] Load CompositeProfile Failure',
  OpenCompositionEditor = '[OpenCompositionEditor Open Composition Editor',
  OpenCompositeProfileStructureEditor = '[OpenCompositeProfileStructureEditor] Open Composition Profile Struture Editor',
  OpenCompositeProfileMetadataEditor = '[OpenCompositeProfileMetadataEditor] Open Composite Profile Metadata Editor',
  OpenCompositeProfilePreDefEditor = '[OpenCompositeProfilePreDefEditor] Open Composite Profile PreDef Editor',
  OpenCompositeProfilePostDefEditor = '[OpenCompositeProfilePostDefEditor] Open Composite Profile PostDef Editor',
}

export class LoadCompositeProfile implements Action {
  readonly type = CompositeProfileActionTypes.LoadCompositeProfile;
  constructor(readonly id: string) { }
}

export class LoadCompositeProfileSuccess implements Action {
  readonly type = CompositeProfileActionTypes.LoadCompositeProfileSuccess;
  constructor(readonly payload: ICompositeProfile) { }
}

export class LoadCompositeProfileFailure implements Action {
  readonly type = CompositeProfileActionTypes.LoadCompositeProfileFailure;
  constructor(readonly error: HttpErrorResponse) { }
}

export class OpenCompositionEditor extends OpenEditorBase {
  readonly type = CompositeProfileActionTypes.OpenCompositionEditor;
  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) {
    super();
  }
}

export class OpenCompositeProfileStructureEditor extends OpenEditorBase {
  readonly type = CompositeProfileActionTypes.OpenCompositeProfileStructureEditor;
  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) {
    super();
  }
}

export class OpenCompositeProfileMetadataEditor implements Action {
  readonly type = CompositeProfileActionTypes.OpenCompositeProfileMetadataEditor;
  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) { }
}

export class OpenCompositeProfilePreDefEditor implements Action {
  readonly type = CompositeProfileActionTypes.OpenCompositeProfilePreDefEditor;
  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) { }
}

export class OpenCompositeProfilePostDefEditor implements Action {
  readonly type = CompositeProfileActionTypes.OpenCompositeProfilePostDefEditor;
  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) { }
}

export type CompositeProfileActions = LoadCompositeProfile | LoadCompositeProfileSuccess | LoadCompositeProfileFailure | OpenCompositionEditor | OpenCompositeProfileStructureEditor  | OpenCompositeProfilePostDefEditor | OpenCompositeProfilePreDefEditor | OpenCompositeProfileMetadataEditor;
