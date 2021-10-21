import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { IHL7EditorMetadata } from '../../modules/shared/models/editor.enum';
import { OpenEditorBase } from '../ig/ig-edit/ig-edit.index';
import { IConformanceProfile } from './../../modules/shared/models/conformance-profile.interface';

export enum ConformanceProfileEditActionTypes {
  LoadConformanceProfile = '[ConformanceProfileEdit] Load Conformance Profile',
  LoadConformanceProfileSuccess = '[ConformanceProfileEdit] Load Conformance Profile Success',
  LoadConformanceProfileFailure = '[ConformanceProfileEdit] Load Conformance Profile Failure',
  OpenConformanceProfilePreDefEditor = '[ConformanceProfileEdit] Open Conformance Profile PreDef Editor',
  OpenConformanceProfilePostDefEditor = '[ConformanceProfileEdit] Open Conformance Profile PostDef Editor',
  OpenConformanceProfileDeltaEditor = '[ConformanceProfileEdit] Open Conformance Profile Delta Editor',
  OpenConformanceProfileStructureEditor = '[ConformanceProfileEdit] Open Conformance Profile Structure Editor',
  OpenConformanceProfileMetadataEditor = '[ConformanceProfileEdit] Open Conformance Profile Metadata Editor',
  OpenConformanceProfileCoConstraintBindingsEditor = '[ConformanceProfileEdit] Open Conformance Profile CoConstraint Bindings Editor',
  OpenCPConformanceStatementEditor = '[ConformanceProfileEdit] Open Conformance Profile Conformance Statement Editor',
  OpenConformanceProfileBindingsEditor = '[ConformanceProfileEdit] Open ConformanceProfile Bindings Editor',
  OpenConformanceProfileSlicingEditor = '[ConformanceProfileEdit] Open ConformanceProfile Slicing Editor',

}

export class LoadConformanceProfile implements Action {
  readonly type = ConformanceProfileEditActionTypes.LoadConformanceProfile;
  constructor(readonly id: string) { }
}

export class LoadConformanceProfileSuccess implements Action {
  readonly type = ConformanceProfileEditActionTypes.LoadConformanceProfileSuccess;
  constructor(readonly payload: IConformanceProfile) { }
}

export class LoadConformanceProfileFailure implements Action {
  readonly type = ConformanceProfileEditActionTypes.LoadConformanceProfileFailure;
  constructor(readonly error: HttpErrorResponse) { }
}

export class OpenConformanceProfilePreDefEditor extends OpenEditorBase {
  readonly type = ConformanceProfileEditActionTypes.OpenConformanceProfilePreDefEditor;
  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) {
    super();
  }
}

export class OpenConformanceProfileDeltaEditor extends OpenEditorBase {
  readonly type = ConformanceProfileEditActionTypes.OpenConformanceProfileDeltaEditor;
  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) {
    super();
  }
}

export class OpenConformanceProfileStructureEditor extends OpenEditorBase {
  readonly type = ConformanceProfileEditActionTypes.OpenConformanceProfileStructureEditor;
  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) {
    super();
  }
}

export class OpenConformanceProfileSlicingEditor extends OpenEditorBase {
  readonly type = ConformanceProfileEditActionTypes.OpenConformanceProfileSlicingEditor;
  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) {
    super();
  }
}

export class OpenConformanceProfileBindingsEditor extends OpenEditorBase {
  readonly type = ConformanceProfileEditActionTypes.OpenConformanceProfileBindingsEditor;
  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) {
    super();
  }
}

export class OpenConformanceProfileCoConstraintBindingsEditor extends OpenEditorBase {
  readonly type = ConformanceProfileEditActionTypes.OpenConformanceProfileCoConstraintBindingsEditor;
  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) {
    super();
  }
}

export class OpenConformanceProfileMetadataEditor extends OpenEditorBase {
  readonly type = ConformanceProfileEditActionTypes.OpenConformanceProfileMetadataEditor;
  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) {
    super();
  }
}

export class OpenConformanceProfilePostDefEditor extends OpenEditorBase {
  readonly type = ConformanceProfileEditActionTypes.OpenConformanceProfilePostDefEditor;
  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) {
    super();
  }
}

export class OpenCPConformanceStatementEditor extends OpenEditorBase {
  readonly type = ConformanceProfileEditActionTypes.OpenCPConformanceStatementEditor;
  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) {
    super();
  }
}

export type ConformanceProfileEditActions =
  | LoadConformanceProfile
  | OpenConformanceProfilePreDefEditor
  | OpenConformanceProfilePostDefEditor
  | OpenConformanceProfileStructureEditor
  | OpenConformanceProfileDeltaEditor
  | OpenConformanceProfileMetadataEditor
  | OpenCPConformanceStatementEditor
  | OpenConformanceProfileCoConstraintBindingsEditor
  | LoadConformanceProfileSuccess
  | LoadConformanceProfileFailure;
