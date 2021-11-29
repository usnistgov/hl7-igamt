import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { Message } from '../../modules/dam-framework/models/messages/message.class';
import {IDocumentCreationWrapper} from '../../modules/document/models/document/document-creation.interface';

export enum CreateLibraryActionTypes {
  CreateLibrary = '[Create Library Page] Create Library',
  CreateLibrarySuccess = '[Create Library Page] Create Library Success',
  CreateLibraryFailure = '[Create Library Page] Create Library Failure',
}

export class CreateLibrary implements Action {
  readonly type = CreateLibraryActionTypes.CreateLibrary;

  constructor(readonly payload: IDocumentCreationWrapper) {
  }
}

export class CreateLibraryFailure implements Action {
  readonly type = CreateLibraryActionTypes.CreateLibraryFailure;

  constructor(readonly payload: HttpErrorResponse) {
  }
}

export class CreateLibrarySuccess implements Action {
  readonly type = CreateLibraryActionTypes.CreateLibrarySuccess;

  constructor(readonly payload: Message<string>) {
  }
}

export type CreateLibraryActions =  CreateLibrarySuccess |
  CreateLibraryFailure | CreateLibrary;
