import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { ICoConstraintGroup } from '../../modules/shared/models/co-constraint.interface';
import { IHL7EditorMetadata } from '../../modules/shared/models/editor.enum';
import { OpenEditorBase } from '../ig/ig-edit/ig-edit.actions';

export enum CoConstraintGroupEditActionTypes {
  LoadCoConstraintGroup = '[CoConstraintGroupEdit] Load CoConstraints Group',
  LoadCoConstraintGroupSuccess = '[CoConstraintGroupEdit] Load CoConstraints Group Success',
  LoadCoConstraintGroupFailure = '[CoConstraintGroupEdit] Load CoConstraints Group Failure',
  OpenCoConstraintGroupEditor = '[CoConstraintGroupEdit] Open CoConstraints Group Editor',
  OpenCoConstraintGroupDeltaEditor = '[CoConstraintGroupEdit] Open CoConstraints Group Delta Editor',
  OpenCoConstraintGroupCrossRefEditor = '[OpenCoConstraintGroupCrossRefEditor] OpenCoConstraint Group CrossRef Editor',
}

export class LoadCoConstraintGroup implements Action {
  readonly type = CoConstraintGroupEditActionTypes.LoadCoConstraintGroup;
  constructor(readonly id: string) { }
}

export class LoadCoConstraintGroupSuccess implements Action {
  readonly type = CoConstraintGroupEditActionTypes.LoadCoConstraintGroupSuccess;
  constructor(readonly payload: ICoConstraintGroup) { }
}

export class LoadCoConstraintGroupFailure implements Action {
  readonly type = CoConstraintGroupEditActionTypes.LoadCoConstraintGroupFailure;
  constructor(readonly error: HttpErrorResponse) { }
}
export class OpenCoConstraintGroupCrossRefEditor extends OpenEditorBase implements Action {
  readonly type = CoConstraintGroupEditActionTypes.OpenCoConstraintGroupCrossRefEditor;
  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) {
    super();
  }
}
export class OpenCoConstraintGroupDeltaEditor extends OpenEditorBase implements Action {
  readonly type = CoConstraintGroupEditActionTypes.OpenCoConstraintGroupDeltaEditor;
  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) {
    super();
  }
}
export class OpenCoConstraintGroupEditor extends OpenEditorBase implements Action {
  readonly type = CoConstraintGroupEditActionTypes.OpenCoConstraintGroupEditor;
  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) {
    super();
  }
}

export type CoConstraintGroupEditActions =
  LoadCoConstraintGroup
  | LoadCoConstraintGroupSuccess
  | LoadCoConstraintGroupFailure
  | OpenCoConstraintGroupEditor
  | OpenCoConstraintGroupCrossRefEditor
  | OpenCoConstraintGroupDeltaEditor;
