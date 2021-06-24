import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { IHL7EditorMetadata } from '../../modules/shared/models/editor.enum';
import { IProfileComponent, IProfileComponentContext } from '../../modules/shared/models/profile.component';

export enum ProfileComponentActionTypes {
  LoadProfileComponent = '[ProfileComponent] Load Profile Component',
  LoadProfileComponentSuccess = '[ProfileComponent] Load Profile Component Success',
  LoadProfileComponentFailure = '[ProfileComponent] Load Profile Component Failure',
  LoadContext = '[ProfileComponent] Load  Context',
  LoadContextSuccess = '[ProfileComponent] Load  Context Success',
  LoadContextFailure = '[ProfileComponent] Load  Context Failure',
  OpenContextStructureEditor = '[ProfileComponent] Open  Context Structure Editor',
  OpenProfileComponentMetadataEditor = '[ProfileComponent] Open Profile Component Metadata Editor',
  OpenProfileComponentSegmentConformanceStatementEditor = '[ProfileComponent] Open Profile Component Segment Conformance Statement Editor',
  OpenProfileComponentMessageConformanceStatementEditor = '[ProfileComponent] Open Profile Component Message Conformance Statement Editor',
  OpenSegmentContextDynamicMappingEditor = '[ProfileComponent] Open Profile Component Segment Dynamic Mapping Editor',
  OpenProfileComponentMessageCoConstraintsEditor = '[ProfileComponent] Open Profile Component Message Co-Constraints Editor',
}

export class LoadProfileComponent implements Action {
  readonly type = ProfileComponentActionTypes.LoadProfileComponent;
  constructor(readonly id: string) { }
}

export class LoadContext implements Action {
  readonly type = ProfileComponentActionTypes.LoadContext;
  constructor(readonly id: string) { }
}

export class LoadContextSuccess implements Action {
  readonly type = ProfileComponentActionTypes.LoadContextSuccess;
  constructor(readonly context: IProfileComponentContext) { }
}

export class LoadProfileComponentFailure implements Action {
  readonly type = ProfileComponentActionTypes.LoadProfileComponentFailure;
  constructor(readonly error: HttpErrorResponse) { }
}
export class LoadProfileComponentSuccess implements Action {
  readonly type = ProfileComponentActionTypes.LoadProfileComponentSuccess;
  constructor(readonly profileComponent: IProfileComponent) { }
}

export class LoadContextFailure implements Action {
  readonly type = ProfileComponentActionTypes.LoadContextFailure;
  constructor(readonly error: HttpErrorResponse) { }
}

export class OpenContextStructureEditor implements Action {
  readonly type = ProfileComponentActionTypes.OpenContextStructureEditor;
  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) { }
}

export class OpenProfileComponentMetadataEditor implements Action {
  readonly type = ProfileComponentActionTypes.OpenProfileComponentMetadataEditor;
  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) { }
}

export class OpenProfileComponentMessageConformanceStatementEditor implements Action {
  readonly type = ProfileComponentActionTypes.OpenProfileComponentMessageConformanceStatementEditor;
  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) { }
}

export class OpenProfileComponentSegmentConformanceStatementEditor implements Action {
  readonly type = ProfileComponentActionTypes.OpenProfileComponentSegmentConformanceStatementEditor;
  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) { }
}

export class OpenSegmentContextDynamicMappingEditor implements Action {
  readonly type = ProfileComponentActionTypes.OpenSegmentContextDynamicMappingEditor;

  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) {
  }
}
export class OpenProfileComponentMessageCoConstraintsEditor implements Action {
  readonly type = ProfileComponentActionTypes.OpenProfileComponentMessageCoConstraintsEditor;
  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) { }
}

export type ProfileComponentActions =
  LoadProfileComponent |
  LoadContext |
  LoadContextSuccess |
  LoadContextFailure |
  OpenContextStructureEditor |
  LoadProfileComponentFailure |
  LoadProfileComponentSuccess |
  OpenProfileComponentMetadataEditor |
  OpenProfileComponentMessageConformanceStatementEditor |
  OpenProfileComponentSegmentConformanceStatementEditor |
  OpenSegmentContextDynamicMappingEditor |
  OpenProfileComponentMessageCoConstraintsEditor;
