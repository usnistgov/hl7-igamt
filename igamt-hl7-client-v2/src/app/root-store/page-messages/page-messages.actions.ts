import { Action } from '@ngrx/store';
import { UserMessage } from '../../modules/core/models/message/message.class';

export enum PageMessagesActionTypes {
  AddMessage = '[PageMessages] Add Message',
  DeleteMessage = '[PageMessages] Delete Message',
  ClearAll = '[PageMessages] Clear All',
}

// [PageMessages] Add Messages, dispatched to add alert messages
export class AddMessage implements Action {
  readonly type = PageMessagesActionTypes.AddMessage;
  constructor(readonly payload: UserMessage) { }
}

// [PageMessages] Delete Messages, dispatched to delete alert messages
export class DeleteMessage implements Action {
  readonly type = PageMessagesActionTypes.DeleteMessage;
  constructor(readonly id: string) { }
}

// [PageMessages] Clear All, Dispatched to clear all alerts
export class ClearAll implements Action {
  readonly type = PageMessagesActionTypes.ClearAll;
}

export type PageMessagesActions = AddMessage | DeleteMessage | ClearAll;
