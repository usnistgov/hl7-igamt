import { Action } from '@ngrx/store';
import { UserMessage } from '../../models/messages/message.class';

export enum MessagesActionTypes {
  AddMessage = '[DAMF Messages] Add Message',
  DeleteMessage = '[DAMF Messages] Delete Message',
  ClearAll = '[DAMF Messages] Clear All',
  Notify = '[DAMF Messages] Notify',
}

export class AddMessage implements Action {
  readonly type = MessagesActionTypes.AddMessage;

  constructor(readonly payload: UserMessage) { }
}

export class DeleteMessage implements Action {
  readonly type = MessagesActionTypes.DeleteMessage;

  constructor(readonly id: string) { }
}

export class ClearAll implements Action {
  readonly type = MessagesActionTypes.ClearAll;
}

export class Notify implements Action {
  readonly type = MessagesActionTypes.Notify;

  constructor(readonly payload: UserMessage) { }
}

export type MessagesActions = AddMessage | DeleteMessage | ClearAll | Notify;
