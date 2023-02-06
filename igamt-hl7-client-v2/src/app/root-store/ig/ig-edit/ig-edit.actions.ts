import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { IResource } from 'src/app/modules/shared/models/resource.interface';
import {
  IAddNodes, IAddProfileComponentContext,
  IAddResourceFromFile,
  ICopyNode,
  ICopyResourceResponse,
  ICreateCoConstraintGroup,
  ICreateCoConstraintGroupResponse, ICreateCompositeProfile, ICreateProfileComponent, ICreateProfileComponentResponse,
  IDeleteNode,
} from '../../../modules/document/models/toc/toc-operation.class';
import { IDocumentDisplayInfo, IgDocument } from '../../../modules/ig/models/ig/ig-document.class';
import { IIgTocFilter } from '../../../modules/ig/services/ig-toc-filter.service';
import { Type } from '../../../modules/shared/constants/type.enum';
import { IContent } from '../../../modules/shared/models/content.interface';
import { IDisplayElement } from '../../../modules/shared/models/display-element.interface';
import { IHL7EditorMetadata } from '../../../modules/shared/models/editor.enum';
import { IDeleteNodes } from './../../../modules/document/models/toc/toc-operation.class';
import { IVerificationRequest } from './../../../modules/shared/models/verification.interface';

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

  DeleteResources = '[Ig Edit TOC] Delete Resources',
  DeleteResourcesSuccess = '[Ig Edit TOC] Delete Resources Success',
  DeleteResourcesFailure = '[Ig Edit TOC] Delete Resources Failure',

  OpenNarrativeEditorNode = '[Ig Edit TOC Narrative] Open Narrative Editor Node',
  OpenIgMetadataEditorNode = '[Ig Edit TOC Ig Metadata] Open Ig Metadata Editor Node',
  OpenConformanceProfileEditorNode = '[Ig Edit TOC Conformance Profile] Open Conformance Profile Editor Node',
  OpenSegmentEditorNode = '[Ig Edit TOC Segment] Open Segment Editor Node',
  OpenDatatypeEditorNode = '[Ig Edit TOC Datatype] Open Datatype Editor Node',
  OpenValueSetEditorNode = '[Ig Edit TOC Value Set] Open Value Set Editor Node',
  OpenConformanceStatementSummaryEditorNode = '[Ig Edit TOC] Open Conformance Statement Summary Editor Node',
  OpenIgVerificationEditor = '[Ig verification] Open Ig Verification Editor',

  TableOfContentSave = '[Ig Edit TOC Save] Save Table Of Content',
  TableOfContentSaveSuccess = '[Ig Edit TOC Save] Save Table Of Content Success',
  TableOfContentSaveFailure = '[Ig Edit TOC Save] Save Table Of Content Failure',

  LoadSelectedResource = '[Router Resolver] Load Selected Resource',

  ClearIgEdit = '[Editor Leave] Clear Ig Edit State',

  ImportResourceFromFile = '[Ig Edit] Import resource from file',
  ImportResourceFromFileSuccess = '[Ig Edit] Import resource from file Success',
  ImportResourceFromFileFailure = '[Ig Edit] Import resource from file Failure',
  ToggleDelta = '[Ig Edit] Toggle DELTA Delta',
  ToggleDeltaSuccess = '[Ig Edit] Toggle DELTA Success',
  ToggleDeltaFailure = '[Ig Edit] Toggle DELTA Failure',

  CreateProfileComponent = '[Ig Edit TOC] Create Profile Component',
  CreateProfileComponentSuccess = '[Ig Edit TOC] Create Profile Component Success',
  CreateProfileComponentFailure = '[Ig Edit TOC] Create Profile Component Failure',

  AddProfileComponentContext = '[Ig Edit TOC] Add Profile Component Context',
  AddProfileComponentContextSuccess = '[Ig Edit TOC] Add Profile Component Context Success',
  AddProfileComponentContextFailure = '[Ig Edit TOC] Add Profile Component Context Failure',

  DeleteProfileComponentContext = '[Ig Edit TOC] Delete Profile Component Context',
  DeleteProfileComponentContextSuccess = '[Ig Edit TOC] Delete Profile Component Context Success',
  DeleteProfileComponentContextFailure = '[Ig Edit TOC] Delete Profile Component Context Failure',

  CreateCompositeProfile = '[Ig Edit TOC] Create Composite Profile',
  CreateCompositeProfileSuccess = '[Ig Edit TOC] Create Create Composite Profile Success',
  CreateCompositeProfileFailure = '[Ig Edit TOC] Create Create Composite Profile Failure',

  VerifiyIg = '[Ig Edit TOC] Verify IG',
  VerifyIgSuccess = '[Ig Edit TOC] Verify Ig Success',
  VerifyIgFailure = '[Ig Edit TOC] Verify Ig Failure',

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

export class IgEditResolverLoad implements Action {
  readonly type = IgEditActionTypes.IgEditResolverLoad;
  constructor(readonly id: string) {
  }
}

export class IgEditResolverLoadSuccess implements Action {
  readonly type = IgEditActionTypes.IgEditResolverLoadSuccess;
  constructor(readonly igInfo: IDocumentDisplayInfo<IgDocument>) {
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

export class ImportResourceFromFile implements Action {
  readonly type = IgEditActionTypes.ImportResourceFromFile;
  constructor(readonly documentId, readonly resourceType: Type, readonly targetType: Type, readonly file: any) {
  }
}

export class ImportResourceFromFileSuccess implements Action {
  readonly type = IgEditActionTypes.ImportResourceFromFileSuccess;
  constructor(readonly payload: IAddResourceFromFile) {
  }
}

export class ImportResourceFromFileFailure implements Action {
  readonly type = IgEditActionTypes.ImportResourceFromFileFailure;
  constructor(readonly error: HttpErrorResponse) {
  }
}

export class AddResourceSuccess implements Action {
  readonly type = IgEditActionTypes.AddResourceSuccess;
  constructor(readonly payload: IDocumentDisplayInfo<IgDocument>) {
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
  constructor(readonly payload: IDisplayElement, readonly redirect: boolean, readonly url) {
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

export abstract class OpenEditorBase implements Action {
  readonly type: string;
  readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  };

  constructor() {
  }
}

export class OpenNarrativeEditorNode extends OpenEditorBase {
  readonly type = IgEditActionTypes.OpenNarrativeEditorNode;

  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) {
    super();
  }
}

export class OpenConformanceStatementSummaryEditorNode extends OpenEditorBase {
  readonly type = IgEditActionTypes.OpenConformanceStatementSummaryEditorNode;

  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) {
    super();
  }
}

export class OpenIgMetadataEditorNode extends OpenEditorBase {
  readonly type = IgEditActionTypes.OpenIgMetadataEditorNode;

  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) {
    super();
  }
}

export class OpenIgVerificationEditor extends OpenEditorBase {
  readonly type = IgEditActionTypes.OpenIgVerificationEditor;

  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) {
    super();
  }
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
  constructor(readonly igInfo: IDocumentDisplayInfo<IgDocument>, readonly deltaMode: boolean) { }
}

export class ToggleDeltaFailure implements Action {
  readonly type = IgEditActionTypes.ToggleDeltaFailure;
  constructor(readonly error: HttpErrorResponse) { }

}

export class CreateProfileComponent implements Action {
  readonly type = IgEditActionTypes.CreateProfileComponent;
  constructor(readonly payload: ICreateProfileComponent) {
  }
}

export class CreateProfileComponentSuccess implements Action {
  readonly type = IgEditActionTypes.CreateProfileComponentSuccess;
  constructor(readonly payload: ICreateProfileComponentResponse) {
  }
}

export class CreateProfileComponentFailure implements Action {
  readonly type = IgEditActionTypes.CreateProfileComponentFailure;
  constructor(readonly payload: HttpErrorResponse) {
  }
}

export class AddProfileComponentContext implements Action {
  readonly type = IgEditActionTypes.AddProfileComponentContext;
  constructor(readonly payload: IAddProfileComponentContext) {
  }
}

export class AddProfileComponentContextSuccess implements Action {
  readonly type = IgEditActionTypes.AddProfileComponentContextSuccess;
  constructor(readonly payload: ICreateProfileComponentResponse) {
  }
}

export class AddProfileComponentContextFailure implements Action {
  readonly type = IgEditActionTypes.AddProfileComponentContextFailure;
  constructor(readonly payload: HttpErrorResponse) {
  }
}

export class DeleteProfileComponentContextFailure implements Action {
  readonly type = IgEditActionTypes.DeleteProfileComponentContextFailure;
  constructor(readonly error: HttpErrorResponse) {
  }
}

export class DeleteProfileComponentContext implements Action {
  readonly type = IgEditActionTypes.DeleteProfileComponentContext;
  constructor(readonly payload: IDeleteNode) {
  }
}
export class DeleteProfileComponentContextSuccess implements Action {
  readonly type = IgEditActionTypes.DeleteProfileComponentContextSuccess;
  constructor(readonly payload: IDisplayElement) {
  }
}

export class CreateCompositeProfile implements Action {
  readonly type = IgEditActionTypes.CreateCompositeProfile;
  constructor(readonly payload: ICreateCompositeProfile) {
  }
}

export class CreateCompositeProfileSuccess implements Action {
  readonly type = IgEditActionTypes.CreateCompositeProfileSuccess;
  constructor(readonly payload: ICreateProfileComponentResponse) {
  }
}

export class CreateCompositeProfileFailure implements Action {
  readonly type = IgEditActionTypes.CreateCompositeProfileFailure;
  constructor(readonly payload: HttpErrorResponse) {
  }
}
export class DeleteResources implements Action {
  readonly type = IgEditActionTypes.DeleteResources;
  constructor(readonly payload: IDeleteNodes) {
  }
}
export class DeleteResourcesSuccess implements Action {
  readonly type = IgEditActionTypes.DeleteResourcesSuccess;
  constructor(readonly ids: string [], readonly redirect: boolean, readonly url) {
  }
}
export class DeleteResourcesFailure implements Action {
  readonly type = IgEditActionTypes.DeleteResourcesFailure;
  constructor(readonly error: HttpErrorResponse) {
  }
}

export class VerifyIgFailure implements Action {
  readonly type = IgEditActionTypes.VerifyIgFailure;
  constructor(readonly error: HttpErrorResponse) {
  }
}
export class VerifyIgSuccess implements Action {
  readonly type = IgEditActionTypes.VerifyIgSuccess;
  constructor(readonly result: IVerificationRequest) {
  }
}

export class VerifyIg implements Action {
  readonly type = IgEditActionTypes.VerifiyIg;
  constructor(readonly payload: IVerificationRequest ) {
  }
}

export type IgEditActions =
  IgEditResolverLoad
  | IgEditResolverLoadSuccess
  | IgEditResolverLoadFailure
  | UpdateSections
  | IgEditDeleteNode
  | TableOfContentSave
  | TableOfContentSaveSuccess
  | OpenIgMetadataEditorNode
  | ClearIgEdit
  | OpenNarrativeEditorNode
  | IgEditTocAddResource
  | AddResourceSuccess
  | CopyResource
  | CopyResourceSuccess
  | LoadSelectedResource
  | CopyResourceFailure
  | DeleteResource
  | DeleteResourceSuccess
  | DeleteResourceFailure
  | ImportResourceFromFile
  | ImportResourceFromFileSuccess
  | ImportResourceFromFileFailure
  | ToggleDelta
  | ToggleDeltaSuccess
  | CreateCoConstraintGroupFailure
  | CreateCoConstraintGroupSuccess
  | CreateCoConstraintGroup
  | CreateProfileComponent
  | CreateProfileComponentSuccess
  | CreateProfileComponentFailure
  | AddProfileComponentContext
  | AddProfileComponentContextSuccess
  | AddProfileComponentContextFailure
  | ToggleDeltaFailure
  | CreateCompositeProfile
  | CreateCompositeProfileSuccess
  | CreateCompositeProfileFailure
  | DeleteResources
  | DeleteResourcesSuccess
  | DeleteResourcesFailure
  | VerifyIg
  | VerifyIgSuccess
  | VerifyIgFailure;
