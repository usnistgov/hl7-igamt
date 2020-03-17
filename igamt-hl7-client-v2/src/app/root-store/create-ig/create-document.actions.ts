import {HttpErrorResponse} from '@angular/common/http';
import {Action} from '@ngrx/store';
import {Message} from '../../modules/core/models/message/message.class';
import {IDocumentCreationWrapper} from '../../modules/document/models/ig/document-creation.interface';
import {MessageEventTreeNode} from '../../modules/document/models/message-event/message-event.class';

export enum CreateDocumentActionTypes {
  LoadMessageEvents = '[Create Document Page] Load Message Events',
  LoadMessageEventsSuccess = '[Create Document Page] Load Message Events Success',
  LoadMessageEventsFailure = '[Create Document Page] Load Message Events Failure',
  CreateDocument = '[Create Document Page] Create Document',
  CreateDocumentSuccess = '[Create Document Page] Create Document Success',
  CreateDocumentFailure = '[Create Document Page] Create Document Failure',
}

export class LoadMessageEvents implements Action {
  readonly type = CreateDocumentActionTypes.LoadMessageEvents;

  constructor(readonly payload: string) {
  }
}

export class LoadMessageEventsSuccess implements Action {
  readonly type = CreateDocumentActionTypes.LoadMessageEventsSuccess;

  constructor(readonly payload: Message<MessageEventTreeNode[]>) {
  }
}

export class LoadMessageEventsFailure implements Action {
  readonly type = CreateDocumentActionTypes.LoadMessageEventsFailure;

  constructor(readonly payload: HttpErrorResponse) {
  }
}

export class CreateDocument implements Action {
  readonly type = CreateDocumentActionTypes.CreateDocument;

  constructor(readonly payload: IDocumentCreationWrapper) {
  }
}

export class CreateDocumentFailure implements Action {
  readonly type = CreateDocumentActionTypes.CreateDocumentFailure;

  constructor(readonly payload: HttpErrorResponse) {
  }
}

export class CreateDocumentSuccess implements Action {
  readonly type = CreateDocumentActionTypes.CreateDocumentSuccess;

  constructor(readonly payload: Message<string>) {
  }
}

export type CreateDocumentActions = LoadMessageEvents | LoadMessageEventsSuccess |
  LoadMessageEventsFailure | CreateDocumentSuccess |
  CreateDocumentFailure | CreateDocument;
