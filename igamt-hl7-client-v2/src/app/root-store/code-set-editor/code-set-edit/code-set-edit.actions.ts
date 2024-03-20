import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { ICodeSetInfo } from 'src/app/modules/code-set-editor/models/code-set.models';
import { OpenEditorBase } from 'src/app/modules/dam-framework/store';
import { IHL7EditorMetadata } from 'src/app/modules/shared/models/editor.enum';

export enum CodeSetEditActionTypes {
  CodeSetEditResolverLoad = '[CodeSet Edit Resolver ] Load CodeSet',
  CodeSetEditResolverLoadSuccess = '[CodeSet Edit Resolver] Load CodeSet Success',
  CodeSetEditResolverLoadFailure = '[CodeSet Edit Resolver] Load CodeSet Failure',
  OpenCodeSetMetadataEditor = '[CodeSet Edit] Open CodeSet Metadata Editor',
  OpenCodeSetDashboardEditor = '[CodeSet Edit] Open CodeSet DashBoard Editor',
  OpenCodeSetVersionEditor = '[CodeSet Edit] Open CodeSet Version Editor',
  OpenCodeSetAccessManagementEditor = '[CodeSet Edit] Open CodeSet Access Management Editor',
}

export class CodeSetEditResolverLoad implements Action {
  readonly type = CodeSetEditActionTypes.CodeSetEditResolverLoad;
  constructor(readonly id: string) {
  }
}

export class CodeSetEditResolverLoadSuccess implements Action {
  readonly type = CodeSetEditActionTypes.CodeSetEditResolverLoadSuccess;
  constructor(readonly codeSetInfo: ICodeSetInfo) {
  }
}

export class CodeSetEditResolverLoadFailure implements Action {
  readonly type = CodeSetEditActionTypes.CodeSetEditResolverLoadFailure;
  constructor(readonly error: HttpErrorResponse) {
  }
}

export class OpenCodeSetMetadataEditor extends OpenEditorBase {
  readonly type = CodeSetEditActionTypes.OpenCodeSetMetadataEditor;

  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) {
    super();
  }
}

export class OpenCodeSetVersionEditor extends OpenEditorBase {
  readonly type = CodeSetEditActionTypes.OpenCodeSetVersionEditor;

  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) {
    super();
  }
}

export class OpenCodeSetAccessManagementEditor extends OpenEditorBase {
  readonly type = CodeSetEditActionTypes.OpenCodeSetAccessManagementEditor;

  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) {
    super();
  }
}

export class OpenCodeSetDashboardEditor extends OpenEditorBase {
  readonly type = CodeSetEditActionTypes.OpenCodeSetDashboardEditor;

  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) {
    super();
  }
}
export type CodeSetEditActions = CodeSetEditResolverLoad | CodeSetEditResolverLoadSuccess | CodeSetEditResolverLoadFailure | OpenCodeSetMetadataEditor  | OpenCodeSetVersionEditor | OpenCodeSetAccessManagementEditor;

