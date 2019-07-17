import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { IEditorMetadata } from '../../modules/shared/models/editor.enum';
import { OpenEditorBase } from '../ig/ig-edit/ig-edit.index';
import { IConformanceProfile } from './../../modules/shared/models/conformance-profile.interface';

export enum ConformanceProfileEditActionTypes {
  LoadConformanceProfile = '[ConformanceProfileEdit] Load Conformance Profile',
  LoadConformanceProfileSuccess = '[ConformanceProfileEdit] Load Conformance Profile Success',
  LoadConformanceProfileFailure = '[ConformanceProfileEdit] Load Conformance Profile Failure',
  OpenConformanceProfilePreDefEditor = '[ConformanceProfileEdit] Open Conformance Profile PreDef Editor',
  OpenConformanceProfilePostDefEditor = '[ConformanceProfileEdit] Open Conformance Profile PostDef Editor',
  OpenConformanceProfileStructureEditor = '[ConformanceProfileEdit] Open Conformance Profile Structure Editor',
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
    editor: IEditorMetadata,
  }) {
    super();
  }
}

export class OpenConformanceProfileStructureEditor extends OpenEditorBase {
  readonly type = ConformanceProfileEditActionTypes.OpenConformanceProfileStructureEditor;
  constructor(readonly payload: {
    id: string,
    editor: IEditorMetadata,
  }) {
    super();
  }
}

export class OpenConformanceProfilePostDefEditor extends OpenEditorBase {
  readonly type = ConformanceProfileEditActionTypes.OpenConformanceProfilePostDefEditor;
  constructor(readonly payload: {
    id: string,
    editor: IEditorMetadata,
  }) {
    super();
  }
}

export type ConformanceProfileEditActions =
  | LoadConformanceProfile
  | OpenConformanceProfilePreDefEditor
  | OpenConformanceProfilePostDefEditor
  | OpenConformanceProfileStructureEditor
  | LoadConformanceProfileSuccess
  | LoadConformanceProfileFailure;
