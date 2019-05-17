import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { IGDisplayInfo } from '../../../modules/ig/models/ig/ig-document.class';
import { IAddNodes, IDeleteNode } from '../../../modules/ig/models/toc/toc-operation.class';
import { IContent } from '../../../modules/shared/models/content.interface';
import { IDisplayElement } from '../../../modules/shared/models/display-element.interface';
import { IEditorMetadata } from '../../../modules/shared/models/editor.enum';

export enum IgEditActionTypes {
  IgEditResolverLoad = '[Ig Edit Resolver] Load Ig',
  IgEditResolverLoadSuccess = '[Ig Edit Resolver] Ig Load Success',
  IgEditResolverLoadFailure = '[Ig Edit Resolver] Ig Load Failure',
  UpdateSections = '[Ig Edit TOC] Update Sections',
  IgEditTocAddResource = '[Ig Edit TOC] Add Resource',
  IgEditDeleteNode = '[Ig Edit TOC] Delete Node',
  AddResourceSuccess = '[Ig Edit TOC] Add Resource Success',
  AddResourceFailure = '[Ig Edit TOC] Add Resource Failure',

  UpdateActiveResource = '[Ig Edit Editor] Update Active Resource Display',
  OpenEditor = '[Ig Edit Open] Open Editor',
  OpenNarrativeEditorNode = '[Ig Edit TOC Narrative] Open Narrative Editor Node',
  OpenIgMetadataEditorNode = '[Ig Edit TOC Ig Metadata] Open Ig Metadata Editor Node',
  OpenConformanceProfileEditorNode = '[Ig Edit TOC Conformance Profile] Open Conformance Profile Editor Node',
  OpenSegmentEditorNode = '[Ig Edit TOC Segment] Open Segment Editor Node',
  OpenDatatypeEditorNode = '[Ig Edit TOC Datatype] Open Datatype Editor Node',
  OpenValueSetEditorNode = '[Ig Edit TOC Value Set] Open Value Set Editor Node',

  ToolbarSave = '[Toolbar Save] Toolbar Save Button',

  TableOfContentSave = '[Ig Edit TOC Save] Save Table Of Content',
  TableOfContentSaveSuccess = '[Ig Edit TOC Save] Save Table Of Content Success',
  TableOfContentSaveFailure = '[Ig Edit TOC Save] Save Table Of Content Failure',

  EditorInitialize = '[Ig Edit Initialize] Initialize Editor Data',
  EditorChange = '[Ig Edit Change] Register Change Data',
  EditorReset = '[Ig Edit Reset] Reset Data',
  EditorSave = '[Editor Save] Toolbar Save Button',
  EditorSaveSuccess = '[Editor Save Success] Editor Save Success',
  EditorSaveFailure = '[Editor Save Failure] Editor Save Failure',

  ClearIgEdit = '[Editor Leave] Clear Ig Edit State',
}

export class ClearIgEdit implements Action {
  readonly type = IgEditActionTypes.ClearIgEdit;

  constructor() {
  }

}

export class IgEditResolverLoad implements Action {
  readonly type = IgEditActionTypes.IgEditResolverLoad;
  constructor(readonly id: string) {
  }
}

export class IgEditResolverLoadSuccess implements Action {
  readonly type = IgEditActionTypes.IgEditResolverLoadSuccess;
  constructor(readonly igInfo: IGDisplayInfo) {
  }
}

export class IgEditResolverLoadFailure implements Action {
  readonly type = IgEditActionTypes.IgEditResolverLoadFailure;
  constructor(readonly error: HttpErrorResponse) {
  }
}

export class UpdateSections implements Action {
  readonly type = IgEditActionTypes.UpdateSections;
  constructor(readonly payload: IDisplayElement[]) {
  }
}

export class IgEditTocAddResource implements Action {
  readonly type = IgEditActionTypes.IgEditTocAddResource;
  constructor(readonly payload: IAddNodes) {
  }
}
export class AddResourceSuccess implements Action {
  readonly type = IgEditActionTypes.AddResourceSuccess;
  constructor(readonly payload: IGDisplayInfo) {
  }
}

export class AddResourceFailure implements Action {
  readonly type = IgEditActionTypes.AddResourceFailure;
  constructor(readonly error: HttpErrorResponse) {
  }
}

export class IgEditDeleteNode implements Action {
  readonly type = IgEditActionTypes.IgEditDeleteNode;
  constructor(readonly payload: IDeleteNode) {
  }
}

export class OpenNarrativeEditorNode implements Action {
  readonly type = IgEditActionTypes.OpenNarrativeEditorNode;

  constructor(readonly payload: {
    id: string,
    editor: IEditorMetadata,
  }) {
  }
}

export class OpenIgMetadataEditorNode implements Action {
  readonly type = IgEditActionTypes.OpenIgMetadataEditorNode;

  constructor(readonly payload: {
    id: string,
    editor: IEditorMetadata,
  }) {
  }
}

export class OpenEditor implements Action {
  readonly type = IgEditActionTypes.OpenEditor;

  constructor(readonly payload: {
    element: IDisplayElement,
    editor: IEditorMetadata,
    initial: any,
  }) {
  }
}

export class EditorInitialize implements Action {
  readonly type = IgEditActionTypes.EditorInitialize;

  constructor(readonly payload: {
    current: any,
    editor: any,
  }) {
  }
}

export class EditorChange implements Action {
  readonly type = IgEditActionTypes.EditorChange;

  constructor(readonly payload: {
    data: any;
    valid: boolean;
    date: Date;
  }) {
  }
}

export class EditorReset implements Action {
  readonly type = IgEditActionTypes.EditorReset;

  constructor() {
  }
}

export class ToolbarSave implements Action {
  readonly type = IgEditActionTypes.ToolbarSave;

  constructor() {
  }
}

export class EditorSave implements Action {
  readonly type = IgEditActionTypes.EditorSave;

  constructor(readonly payload: {
    tocSaveStatus: boolean,
  }) {
  }
}

export class EditorSaveSuccess implements Action {
  readonly type = IgEditActionTypes.EditorSaveSuccess;

  constructor(readonly current?: any) {
  }
}

export class EditorSaveFailure implements Action {
  readonly type = IgEditActionTypes.EditorSaveFailure;

  constructor() {
  }
}

export class UpdateActiveResource implements Action {
  readonly type = IgEditActionTypes.UpdateActiveResource;

  constructor(readonly payload: IDisplayElement) { }
}

export class TableOfContentSave implements Action {
  readonly type = IgEditActionTypes.TableOfContentSave;

  constructor(readonly payload: {
    sections: IContent[];
    id: string;
  }) { }
}

export class TableOfContentSaveSuccess implements Action {
  readonly type = IgEditActionTypes.TableOfContentSaveSuccess;

  constructor(readonly igId: string) { }
}

export class TableOfContentSaveFailure implements Action {
  readonly type = IgEditActionTypes.TableOfContentSaveFailure;

  constructor(readonly igId: string) { }
}

export type IgEditActions =
  IgEditResolverLoad
  | IgEditResolverLoadSuccess
  | IgEditResolverLoadFailure
  | UpdateSections
  | UpdateActiveResource
  | IgEditDeleteNode
  | OpenEditor
  | EditorInitialize
  | EditorChange
  | EditorReset
  | ToolbarSave
  | EditorSave
  | EditorSaveSuccess
  | TableOfContentSave
  | TableOfContentSaveSuccess
  | OpenIgMetadataEditorNode
  | ClearIgEdit
  | OpenNarrativeEditorNode
  | IgEditTocAddResource
  | AddResourceSuccess;
