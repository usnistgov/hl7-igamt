import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { Message } from '../../modules/dam-framework/models/messages/message.class';
import { IDocumentCreationWrapper } from '../../modules/document/models/document/document-creation.interface';
import { MessageEventTreeNode } from '../../modules/document/models/message-event/message-event.class';
import { Scope } from '../../modules/shared/constants/scope.enum';

export enum CreateIgActionTypes {
  LoadMessageEvents = '[Create IG Page] Load Message Events',
  LoadMessageEventsSuccess = '[Create IG Page] Load Message Events Success',
  LoadMessageEventsFailure = '[Create IG Page] Load Message Events Failure',
  CreateIg = '[Create IG Page] Create IG',
  CreateIgSuccess = '[Create IG Page] Create IG Success',
  CreateIgFailure = '[Create IG Page] Create IG Failure',
}

export class LoadMessageEvents implements Action {
  readonly type = CreateIgActionTypes.LoadMessageEvents;

  constructor(readonly payload: { version: string, scope: Scope }) {
  }
}

export class LoadMessageEventsSuccess implements Action {
  readonly type = CreateIgActionTypes.LoadMessageEventsSuccess;

  constructor(readonly payload: Message<MessageEventTreeNode[]>) {
  }
}

export class LoadMessageEventsFailure implements Action {
  readonly type = CreateIgActionTypes.LoadMessageEventsFailure;

  constructor(readonly payload: HttpErrorResponse) {
  }
}

export class CreateIg implements Action {
  readonly type = CreateIgActionTypes.CreateIg;

  constructor(readonly payload: IDocumentCreationWrapper) {
  }
}

export class CreateIgFailure implements Action {
  readonly type = CreateIgActionTypes.CreateIgFailure;

  constructor(readonly payload: HttpErrorResponse) {
  }
}

export class CreateIgSuccess implements Action {
  readonly type = CreateIgActionTypes.CreateIgSuccess;

  constructor(readonly payload: Message<string>) {
  }
}

export type CreateIgActions = LoadMessageEvents | LoadMessageEventsSuccess |
  LoadMessageEventsFailure | CreateIgSuccess |
  CreateIgFailure | CreateIg;
