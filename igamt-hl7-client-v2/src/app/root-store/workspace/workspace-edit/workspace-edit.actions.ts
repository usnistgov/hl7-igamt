import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { OpenEditorBase } from 'src/app/modules/dam-framework/store/index';
import { IWorkspaceInfo } from '../../../modules/workspace/models/models';
import { IHL7EditorMetadata } from './../../../modules/shared/models/editor.enum';
export enum WorkspaceEditActionTypes {
  WorkspaceEditResolverLoad = '[Workspace Edit Resolver ] Load Workspace',
  WorkspaceEditResolverLoadSuccess = '[Workspace Edit Resolver] Load Workspace Success',
  WorkspaceEditResolverLoadFailure = '[Workspace Edit Resolver] Load Workspace Failure',
  OpenWorkspaceMetadataEditor = '[Workspace Edit] Open Workspace Metadata Editor',
  OpenWorkspaceHomeEditor = '[Workspace Edit] Open Workspace Home Editor',
  OpenWorkspaceFolderEditor = '[Workspace Edit] Open Workspace Folder Editor',
  OpenWorkspaceAccessManagementEditor = '[Workspace Edit] Open Workspace Access Management Editor',
}

export class WorkspaceEditResolverLoad implements Action {
  readonly type = WorkspaceEditActionTypes.WorkspaceEditResolverLoad;
  constructor(readonly id: string) {
  }
}

export class WorkspaceEditResolverLoadSuccess implements Action {
  readonly type = WorkspaceEditActionTypes.WorkspaceEditResolverLoadSuccess;
  constructor(readonly workspaceDisplayInfo: IWorkspaceInfo) {
  }
}

export class WorkspaceEditResolverLoadFailure implements Action {
  readonly type = WorkspaceEditActionTypes.WorkspaceEditResolverLoadFailure;
  constructor(readonly error: HttpErrorResponse) {
  }
}

export class OpenWorkspaceMetadataEditor extends OpenEditorBase {
  readonly type = WorkspaceEditActionTypes.OpenWorkspaceMetadataEditor;

  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) {
    super();
  }
}

export class OpenWorkspaceFolderEditor extends OpenEditorBase {
  readonly type = WorkspaceEditActionTypes.OpenWorkspaceFolderEditor;

  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) {
    super();
  }
}

export class OpenWorkspaceAccessManagementEditor extends OpenEditorBase {
  readonly type = WorkspaceEditActionTypes.OpenWorkspaceAccessManagementEditor;

  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) {
    super();
  }
}

export class OpenWorkspaceHomeEditor extends OpenEditorBase {
  readonly type = WorkspaceEditActionTypes.OpenWorkspaceHomeEditor;

  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) {
    super();
  }
}
export type WorkspaceEditActions = WorkspaceEditResolverLoad | WorkspaceEditResolverLoadSuccess | WorkspaceEditResolverLoadFailure | OpenWorkspaceMetadataEditor | OpenWorkspaceHomeEditor | OpenWorkspaceFolderEditor | OpenWorkspaceAccessManagementEditor;
