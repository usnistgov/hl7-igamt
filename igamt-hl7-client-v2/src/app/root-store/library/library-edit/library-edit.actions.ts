import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { IResource } from 'src/app/modules/shared/models/resource.interface';
import {
  IAddNodes,
  ICopyNode,
  ICopyResourceResponse,
  IDeleteNode,
} from '../../../modules/document/models/toc/toc-operation.class';
import { IDocumentDisplayInfo } from '../../../modules/ig/models/ig/ig-document.class';
import {IPublicationResult} from '../../../modules/library/components/publish-library-dialog/publish-library-dialog.component';
import {ILibrary} from '../../../modules/library/models/library.class';
import { Type } from '../../../modules/shared/constants/type.enum';
import {IDocumentRef} from '../../../modules/shared/models/abstract-domain.interface';
import { IContent } from '../../../modules/shared/models/content.interface';
import { IDisplayElement } from '../../../modules/shared/models/display-element.interface';
import { IHL7EditorMetadata } from '../../../modules/shared/models/editor.enum';

export enum LibraryEditActionTypes {
  LibraryEditResolverLoad = '[Library Edit Resolver] Load Library',
  LibraryEditResolverLoadSuccess = '[Library Edit Resolver] Library Load Success',
  LibraryEditResolverLoadFailure = '[Library Edit Resolver] Library Load Failure',
  UpdateSections = '[Library Edit TOC] Update Sections',
  LibraryEditDeleteNode = '[Library Edit TOC] Delete Node',
  LibraryEditTocAddResource = '[Library Edit TOC] Add Resource',
  AddResourceSuccess = '[Library Edit TOC] Add Resource Success',
  AddResourceFailure = '[Library Edit TOC] Add Resource Failure',
  CreateCoConstraintGroupFailure = '[Library Edit TOC] Create CoConstraint Group Failure',
  CopyResource = '[Library Edit TOC] Copy Resource',
  CopyResourceSuccess = '[Library Edit TOC] Copy Resource Success',
  CopyResourceFailure = '[Library Edit TOC] Copy Resource Failure',
  DeleteResource = '[Library Edit TOC] Delete Resource',
  DeleteResourceSuccess = '[Library Edit TOC] Delete Resource Success',
  DeleteResourceFailure = '[Library Edit TOC] Delete Resource Failure',
  LibOpenNarrativeEditorNode = '[Library Edit TOC Narrative] Open Narrative Editor Node',
  OpenLibraryMetadataEditorNode = '[Library Edit TOC Library Metadata] Open Library Metadata Editor Node',
  TableOfContentSave = '[Library Edit TOC Save] Save Table Of Content',
  TableOfContentSaveSuccess = '[Library Edit TOC Save] Save Table Of Content Success',
  TableOfContentSaveFailure = '[Library Edit TOC Save] Save Table Of Content Failure',
  LoadSelectedResource = '[Router Resolver] Load Selected Resource',
  LoadResourceReferences = '[Library Resource References] Load Resource References',
  LoadResourceReferencesSuccess = '[Library Resource References] Load Resource References Success',
  LoadResourceReferencesFailure = '[Library Resource References] Load Resource References Failure',
  ClearLibraryEdit = '[Editor Leave] Clear Library Edit State',
  ImportResourceFromFile = '[Library Edit] Import resource from file',
  ImportResourceFromFileFailure = '[Library Edit] Import resource from file Failure',
  ToggleDelta = '[Library Edit] Toggle DELTA Delta',
  ToggleDeltaSuccess = '[Library Edit] Toggle DELTA Success',
  ToggleDeltaFailure = '[Library Edit] Toggle DELTA Failure',
  PublishLibrary = '[Library] Publish Library',
  PublishLibrarySuccess = '[Library] Publish Library Success',
  PublishLibraryFailure = '[Library] Publish Library Failure',
  DeactivateElements= '[Library] Deactivate Elements',
  DeactivateElementsSuccess= '[Library] Deactivate Elements Success',
  DeactivateElementsFailure= '[Library] Deactivate Elements Failure',
}

export class ClearLibraryEdit implements Action {
  readonly type = LibraryEditActionTypes.ClearLibraryEdit;
  constructor() {
  }
}
export class LoadSelectedResource implements Action {
  readonly type = LibraryEditActionTypes.LoadSelectedResource;
  constructor(readonly resource: IResource) { }
}

export class LoadResourceReferences implements Action {
  readonly type = LibraryEditActionTypes.LoadResourceReferences;
  constructor(readonly payload: {
    resourceType: Type,
    id: string,
  }) { }
}

export class LoadResourceReferencesSuccess implements Action {
  readonly type = LibraryEditActionTypes.LoadResourceReferencesSuccess;
  constructor(readonly payload: IResource[]) { }
}

export class LoadResourceReferencesFailure implements Action {
  readonly type = LibraryEditActionTypes.LoadResourceReferencesFailure;
  constructor(readonly error: HttpErrorResponse) { }
}

export class LibraryEditResolverLoad implements Action {
  readonly type = LibraryEditActionTypes.LibraryEditResolverLoad;
  constructor(readonly id: string) {
  }
}

export class LibraryEditResolverLoadSuccess implements Action {
  readonly type = LibraryEditActionTypes.LibraryEditResolverLoadSuccess;
  constructor(readonly displayInfo: IDocumentDisplayInfo<ILibrary>) {
  }
}

export class LibraryEditResolverLoadFailure implements Action {
  readonly type = LibraryEditActionTypes.LibraryEditResolverLoadFailure;
  constructor(readonly error: HttpErrorResponse) {
  }
}

export class UpdateSections implements Action {
  readonly type = LibraryEditActionTypes.UpdateSections;
  constructor(readonly payload: IDisplayElement[]) {
  }
}

export class LibraryEditTocAddResource implements Action {
  readonly type = LibraryEditActionTypes.LibraryEditTocAddResource;
  constructor(readonly payload: IAddNodes) {
  }
}

export class ImportResourceFromFile implements Action {
  readonly type = LibraryEditActionTypes.ImportResourceFromFile;
  constructor(readonly documentId, readonly resourceType: Type, readonly targetType: Type, readonly file: any) {
  }
}

export class ImportResourceFromFileFailure implements Action {
  readonly type = LibraryEditActionTypes.ImportResourceFromFileFailure;
  constructor(readonly error: HttpErrorResponse) {
  }
}

export class AddResourceSuccess implements Action {
  readonly type = LibraryEditActionTypes.AddResourceSuccess;
  constructor(readonly payload: IDocumentDisplayInfo<ILibrary>) {
  }
}

export class AddResourceFailure implements Action {
  readonly type = LibraryEditActionTypes.AddResourceFailure;
  constructor(readonly error: HttpErrorResponse) {
  }
}

export class CopyResource implements Action {
  readonly type = LibraryEditActionTypes.CopyResource;
  constructor(readonly payload: ICopyNode) {
  }
}

export class CopyResourceSuccess implements Action {
  readonly type = LibraryEditActionTypes.CopyResourceSuccess;
  constructor(readonly payload: ICopyResourceResponse) {
  }
}

export class CopyResourceFailure implements Action {
  readonly type = LibraryEditActionTypes.CopyResourceFailure;
  constructor(readonly error: HttpErrorResponse) {
  }
}

export class DeleteResource implements Action {
  readonly type = LibraryEditActionTypes.DeleteResource;
  constructor(readonly payload: IDeleteNode) {
  }
}
export class DeleteResourceSuccess implements Action {
  readonly type = LibraryEditActionTypes.DeleteResourceSuccess;
  constructor(readonly payload: IDisplayElement) {
  }
}
export class DeleteResourceFailure implements Action {
  readonly type = LibraryEditActionTypes.DeleteResourceFailure;
  constructor(readonly error: HttpErrorResponse) {
  }
}

export class LibraryEditDeleteNode implements Action {
  readonly type = LibraryEditActionTypes.LibraryEditDeleteNode;
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

export class LibOpenNarrativeEditorNode extends OpenEditorBase {
  readonly type = LibraryEditActionTypes.LibOpenNarrativeEditorNode;

  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) {
    super();
  }
}

export class OpenLibraryMetadataEditorNode extends OpenEditorBase {
  readonly type = LibraryEditActionTypes.OpenLibraryMetadataEditorNode;

  constructor(readonly payload: {
    id: string,
    editor: IHL7EditorMetadata,
  }) {
    super();
  }
}

export class TableOfContentSave implements Action {
  readonly type = LibraryEditActionTypes.TableOfContentSave;

  constructor(readonly payload: {
    sections: IContent[];
    id: string;
  }) { }
}

export class TableOfContentSaveSuccess implements Action {
  readonly type = LibraryEditActionTypes.TableOfContentSaveSuccess;
  constructor(readonly igId: string) { }
}
export class TableOfContentSaveFailure implements Action {
  readonly type = LibraryEditActionTypes.TableOfContentSaveFailure;
  constructor(readonly igId: string) { }
}

export class ToggleDelta implements Action {
  readonly type = LibraryEditActionTypes.ToggleDelta;
  constructor(readonly igId: string, readonly delta: boolean) { }
}

export class ToggleDeltaSuccess implements Action {
  readonly type = LibraryEditActionTypes.ToggleDeltaSuccess;
  constructor(readonly igInfo: IDocumentDisplayInfo<ILibrary>, readonly deltaMode: boolean) { }
}

export class ToggleDeltaFailure implements Action {
  readonly type = LibraryEditActionTypes.ToggleDeltaFailure;
  constructor(readonly error: HttpErrorResponse) { }

}
export class PublishLibraryFailure implements Action {
  readonly type = LibraryEditActionTypes.PublishLibraryFailure;
  constructor(readonly error: HttpErrorResponse) { }

}
export class PublishLibrarySuccess implements Action {
  readonly type = LibraryEditActionTypes.PublishLibrarySuccess;
  constructor(readonly igId: string) { }
}
export class PublishLibrary implements Action {
  readonly type = LibraryEditActionTypes.PublishLibrary;
  constructor(readonly libId: string, readonly publicationResult: IPublicationResult) { }
}

export class DeactivateElements implements Action {
  readonly type = LibraryEditActionTypes.DeactivateElements;
  constructor(readonly documentId: string, readonly elements: string[] ) {
  }
}
export class DeactivateElementsSuccess implements Action {
  readonly type = LibraryEditActionTypes.DeactivateElementsSuccess;
  constructor( elements: IDisplayElement[] ) {
  }
}
export class DeactivateElementsFailure implements Action {
  readonly type = LibraryEditActionTypes.DeactivateElementsFailure;
  constructor(readonly error: HttpErrorResponse ) {
  }
}
export type LibraryEditActions =
  LibraryEditResolverLoad
  | LibraryEditResolverLoadSuccess
  | LibraryEditResolverLoadFailure
  | UpdateSections
  | LibraryEditDeleteNode
  | TableOfContentSave
  | TableOfContentSaveSuccess
  | OpenLibraryMetadataEditorNode
  | ClearLibraryEdit
  | LibOpenNarrativeEditorNode
  | LibraryEditTocAddResource
  | AddResourceSuccess
  | CopyResource
  | CopyResourceSuccess
  | LoadSelectedResource
  | LoadResourceReferences
  | LoadResourceReferencesSuccess
  | LoadResourceReferencesFailure
  | CopyResourceFailure
  | DeleteResource
  | DeleteResourceSuccess
  | DeleteResourceFailure
  | ImportResourceFromFile
  | ImportResourceFromFileFailure
  | ToggleDelta
  | ToggleDeltaSuccess
  | ToggleDeltaFailure
  | PublishLibrary
  | PublishLibrarySuccess
  | PublishLibraryFailure;
