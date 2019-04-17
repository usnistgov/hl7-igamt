import { TemplateRef } from '@angular/core';
import { Guid } from 'guid-typescript';

export interface IMessage<T> {
  readonly status: MessageType;
  readonly text: string;
  readonly data: T;
}

export class Message<T = any> implements IMessage<T> {
  constructor(readonly status: MessageType, readonly text: string, readonly data: T) { }
}

export class UserMessage<T = any> {
  readonly id: string;

  constructor(readonly status: MessageType, readonly message: string, readonly data?: T, readonly options?: IUserMessageOptions) {
    this.id = Guid.create().toString();
  }

  static fromMessage<E = any>(message: Message<E>, options?: IUserMessageOptions) {
    return new UserMessage<E>(message.status, message.text, message.data, options);
  }
}

export interface IUserMessageOptions {
  closable?: boolean;
  timeout?: number;
  template?: TemplateRef<any>;
}

export enum MessageType {
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  INFO = 'INFO',
  FAILED = 'FAILED',
}
