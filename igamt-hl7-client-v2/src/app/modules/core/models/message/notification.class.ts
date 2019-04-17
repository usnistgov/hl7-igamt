import { MessageType } from './message.class';

export class Notification {
  constructor(readonly status: MessageType, readonly summary: string, readonly details: any) { }
}
