import { IHL7EditorMetadata } from './../../../modules/shared/models/editor.enum';
import { OpenEditorBase } from 'src/app/modules/dam-framework/store/index';
import { IWorkspaceDisplayInfo } from './../../../modules/workspace/models/models';
import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
export enum WorkspaceEditActionTypes {
  WorkspaceEditResolverLoad = '[Workspace Edit Resolver ] Load Workspace',
  WorkspaceEditResolverLoadSuccess = '[Workspace Edit Resolver] Load Workspace Success',
  WorkspaceEditResolverLoadFailure = '[Workspace Edit Resolver] Load Workspace Failure',
  OpenWorkspaceMetadataEditor = '[Workspace Edit] Open Workspace Metadata Editor'
}


export class WorkspaceEditResolverLoad implements Action {
  readonly type = WorkspaceEditActionTypes.WorkspaceEditResolverLoad;
  constructor(readonly id: string) {
  }
}

export class WorkspaceEditResolverLoadSuccess implements Action {
  readonly type = WorkspaceEditActionTypes.WorkspaceEditResolverLoadSuccess;
  constructor(readonly workspaceDisplayInfo: IWorkspaceDisplayInfo) {
  }
}

export class WorkspaceEditResolverLoadFailure implements Action{
  readonly type = WorkspaceEditActionTypes.WorkspaceEditResolverLoadFailure;
  constructor(readonly error: HttpErrorResponse) {
  }
}

export class OpenWorkspaceMetadataEditorNode extends OpenEditorBase {
  readonly type = WorkspaceEditActionTypes.OpenWorkspaceMetadataEditor;

  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) {
    super();
  }
}
export type WorkspaceEditActions = WorkspaceEditResolverLoad | WorkspaceEditResolverLoadSuccess | WorkspaceEditResolverLoadFailure | OpenWorkspaceMetadataEditorNode ;
