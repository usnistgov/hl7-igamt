import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { IResource } from 'src/app/modules/shared/models/resource.interface';
import { IGDisplayInfo } from '../../../modules/ig/models/ig/ig-document.class';
import {
  IAddNodes,
  ICopyNode,
  ICopyResourceResponse,
  IDeleteNode,
} from '../../../modules/ig/models/toc/toc-operation.class';
import { ICreateCoConstraintGroupResponse, ICreateCoConstraintGroup } from '../../../modules/ig/models/toc/toc-operation.class';
import { Type } from '../../../modules/shared/constants/type.enum';
import { IContent } from '../../../modules/shared/models/content.interface';
import { IDisplayElement } from '../../../modules/shared/models/display-element.interface';
import { IEditorMetadata } from '../../../modules/shared/models/editor.enum';

export enum IgEditActionTypes {
  IgEditResolverLoad = '[Ig Edit Resolver] Load Ig',
  IgEditResolverLoadSuccess = '[Ig Edit Resolver] Ig Load Success',
  IgEditResolverLoadFailure = '[Ig Edit Resolver] Ig Load Failure',
  UpdateSections = '[Ig Edit TOC] Update Sections',
  IgEditDeleteNode = '[Ig Edit TOC] Delete Node',
  IgEditTocAddResource = '[Ig Edit TOC] Add Resource',
  AddResourceSuccess = '[Ig Edit TOC] Add Resource Success',
  AddResourceFailure = '[Ig Edit TOC] Add Resource Failure',
  CreateCoConstraintGroup = '[Ig Edit TOC] Create CoConstraint Group',
  CreateCoConstraintGroupSuccess = '[Ig Edit TOC] Create CoConstraint Group Success',
  CreateCoConstraintGroupFailure = '[Ig Edit TOC] Create CoConstraint Group Failure',
  CopyResource = '[Ig Edit TOC] Copy Resource',
  CopyResourceSuccess = '[Ig Edit TOC] Copy Resource Success',
  CopyResourceFailure = '[Ig Edit TOC] Copy Resource Failure',
  DeleteResource = '[Ig Edit TOC] Delete Resource',
  DeleteResourceSuccess = '[Ig Edit TOC] Delete Resource Success',
  DeleteResourceFailure = '[Ig Edit TOC] Delete Resource Failure',
  UpdateActiveResource = '[Ig Edit Editor] Update Active Resource Display',
  OpenEditor = '[Ig Edit Open] Open Editor',
  OpenEditorFailure = '[Ig Edit Open] Open Editor Failure',
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
  EditorUpdate = '[Editor Update] Update editor without changes',
  EditorSaveSuccess = '[Editor Save Success] Editor Save Success',
  EditorSaveFailure = '[Editor Save Failure] Editor Save Failure',

  LoadSelectedResource = '[Router Resolver] Load Selected Resource',
  LoadResourceReferences = '[Ig Resource References] Load Resource References',
  LoadResourceReferencesSuccess = '[Ig Resource References] Load Resource References Success',
  LoadResourceReferencesFailure = '[Ig Resource References] Load Resource References Failure',
  ClearIgEdit = '[Editor Leave] Clear Ig Edit State',
  CollapseTOC = '[Ig Edit TOC] Collapse',
  ExpandTOC = '[Ig Edit TOC] Expand',
  ToggleFullScreen = '[Ig Edit] Toggle Fullscreen',
  ToggleDelta = '[Ig Edit] Toggle DELTA Delta',
  ToggleDeltaSuccess = '[Ig Edit] Toggle DELTA Success',
  ToggleDeltaFailure = '[Ig Edit] Toggle DELTA Failure',
}

export class CollapseTOC implements Action {
  readonly type = IgEditActionTypes.CollapseTOC;

  constructor() {
  }

}

export class ExpandTOC implements Action {
  readonly type = IgEditActionTypes.ExpandTOC;

  constructor() {
  }

}

export class ToggleFullScreen implements Action {
  readonly type = IgEditActionTypes.ToggleFullScreen;
  constructor() {
  }
}

export class ClearIgEdit implements Action {
  readonly type = IgEditActionTypes.ClearIgEdit;
  constructor() {
  }
}

export class LoadSelectedResource implements Action {
  readonly type = IgEditActionTypes.LoadSelectedResource;
  constructor(readonly resource: IResource) { }
}

export class LoadResourceReferences implements Action {
  readonly type = IgEditActionTypes.LoadResourceReferences;
  constructor(readonly payload: {
    resourceType: Type,
    id: string,
  }) { }
}

export class LoadResourceReferencesSuccess implements Action {
  readonly type = IgEditActionTypes.LoadResourceReferencesSuccess;
  constructor(readonly payload: IResource[]) { }
}

export class LoadResourceReferencesFailure implements Action {
  readonly type = IgEditActionTypes.LoadResourceReferencesFailure;
  constructor(readonly error: HttpErrorResponse) { }
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

export class CopyResource implements Action {
  readonly type = IgEditActionTypes.CopyResource;
  constructor(readonly payload: ICopyNode) {
  }
}

export class CreateCoConstraintGroup implements Action {
  readonly type = IgEditActionTypes.CreateCoConstraintGroup;
  constructor(readonly payload: ICreateCoConstraintGroup) {
  }
}

export class CreateCoConstraintGroupSuccess implements Action {
  readonly type = IgEditActionTypes.CreateCoConstraintGroupSuccess;
  constructor(readonly payload: ICreateCoConstraintGroupResponse) {
  }
}

export class CreateCoConstraintGroupFailure implements Action {
  readonly type = IgEditActionTypes.CreateCoConstraintGroupFailure;
  constructor(readonly payload: HttpErrorResponse) {
  }
}

export class CopyResourceSuccess implements Action {
  readonly type = IgEditActionTypes.CopyResourceSuccess;
  constructor(readonly payload: ICopyResourceResponse) {
  }
}

export class CopyResourceFailure implements Action {
  readonly type = IgEditActionTypes.CopyResourceFailure;
  constructor(readonly error: HttpErrorResponse) {
  }
}

export class DeleteResource implements Action {
  readonly type = IgEditActionTypes.DeleteResource;
  constructor(readonly payload: IDeleteNode) {
  }
}
export class DeleteResourceSuccess implements Action {
  readonly type = IgEditActionTypes.DeleteResourceSuccess;
  constructor(readonly payload: IDisplayElement) {
  }
}
export class DeleteResourceFailure implements Action {
  readonly type = IgEditActionTypes.DeleteResourceFailure;
  constructor(readonly error: HttpErrorResponse) {
  }
}

export class IgEditDeleteNode implements Action {
  readonly type = IgEditActionTypes.IgEditDeleteNode;
  constructor(readonly payload: IDeleteNode) {
  }
}

export class EditorUpdate implements Action {
  readonly type = IgEditActionTypes.EditorUpdate;
  constructor(readonly payload: {
    value: any,
    updateDate: boolean,
  }) { }
}

export abstract class OpenEditorBase implements Action {
  readonly type: string;
  readonly payload: {
    id: string,
    editor: IEditorMetadata,
  };

  constructor() {
  }
}

export class OpenNarrativeEditorNode extends OpenEditorBase {
  readonly type = IgEditActionTypes.OpenNarrativeEditorNode;

  constructor(readonly payload: {
    id: string,
    editor: IEditorMetadata,
  }) {
    super();
  }
}

export class OpenIgMetadataEditorNode extends OpenEditorBase {
  readonly type = IgEditActionTypes.OpenIgMetadataEditorNode;

  constructor(readonly payload: {
    id: string,
    editor: IEditorMetadata,
  }) {
    super();
  }
}

export class OpenEditor implements Action {
  readonly type = IgEditActionTypes.OpenEditor;

  constructor(readonly payload: {
    id: string,
    element: IDisplayElement,
    editor: IEditorMetadata,
    initial: any,
  }) {
  }
}

export class OpenEditorFailure implements Action {
  readonly type = IgEditActionTypes.OpenEditorFailure;

  constructor(readonly payload: {
    id: string,
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

export class ToggleDelta implements Action {
  readonly type = IgEditActionTypes.ToggleDelta;
  constructor(readonly igId: string, readonly delta: boolean) { }
}

export class ToggleDeltaSuccess implements Action {
  readonly type = IgEditActionTypes.ToggleDeltaSuccess;
  constructor(readonly igInfo: IGDisplayInfo, readonly deltaMode: boolean) { }
}

export class ToggleDeltaFailure implements Action {
  readonly type = IgEditActionTypes.ToggleDeltaFailure;
  constructor(readonly error: HttpErrorResponse) { }

}
export type IgEditActions =
  IgEditResolverLoad
  | IgEditResolverLoadSuccess
  | IgEditResolverLoadFailure
  | UpdateSections
  | UpdateActiveResource
  | IgEditDeleteNode
  | OpenEditor
  | OpenEditorFailure
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
  | CollapseTOC
  | ExpandTOC
  | AddResourceSuccess
  | CopyResource
  | CopyResourceSuccess
  | LoadSelectedResource
  | LoadResourceReferences
  | LoadResourceReferencesSuccess
  | LoadResourceReferencesFailure
  | ToggleFullScreen
  | CopyResourceFailure
  | DeleteResource
  | DeleteResourceSuccess
  | DeleteResourceFailure
  | EditorUpdate
  | ToggleDelta
  | ToggleDeltaSuccess
  | CreateCoConstraintGroupFailure
  | CreateCoConstraintGroupSuccess
  | CreateCoConstraintGroup
  | ToggleDeltaFailure;
