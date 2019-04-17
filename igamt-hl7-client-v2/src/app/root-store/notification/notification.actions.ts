import { Action } from '@ngrx/store';
import { UserMessage } from './../../modules/core/models/message/message.class';

export enum NotificationActionTypes {
  Notify = '[Notification] Notify',
}

export class Notify implements Action {
  readonly type = NotificationActionTypes.Notify;
  constructor(readonly payload: UserMessage) { }
}

export type NotificationActions = Notify;
