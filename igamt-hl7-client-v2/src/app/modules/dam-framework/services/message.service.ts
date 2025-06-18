import { HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { DEFAULT_MESSAGE_OPTION } from '../injection-token';
import { IUserMessageOptions, Message, MessageType, UserMessage } from '../models/messages/message.class';
import { AddMessage, Notify } from '../store/messages/messages.actions';

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  constructor(@Inject(DEFAULT_MESSAGE_OPTION) private defaultOptions: IUserMessageOptions) {
  }

  messageTypeToAlert(status: MessageType): NgbAlertType {
    switch (status) {
      case MessageType.FAILED:
        return 'danger';
      case MessageType.INFO:
        return 'info';
      case MessageType.SUCCESS:
        return 'success';
      case MessageType.WARNING:
        return 'warning';
      default:
        return 'dark';
    }
  }

  // tslint:disable-next-line: no-identical-functions
  messageTypeToNotification(status: MessageType): NotificationSeverity {
    switch (status) {
      case MessageType.FAILED:
        return 'error';
      case MessageType.INFO:
        return 'info';
      case MessageType.SUCCESS:
        return 'success';
      case MessageType.WARNING:
        return 'warn';
      default:
        return 'info';
    }
  }

  messageToAction(message: Message, options?: IUserMessageOptions): Notify | AddMessage {
    const userMessage: UserMessage = UserMessage.fromMessage(
      message,
      this.mergeOptions(options),
    );
    return this.userMessageToAction(userMessage);
  }

  createUserMessage(message: Message, options?: IUserMessageOptions): UserMessage {
    return UserMessage.fromMessage(
      message,
      this.mergeOptions(options),
    );
  }

  userMessageToAction(userMessage: UserMessage): Notify | AddMessage {
    if (userMessage.status === MessageType.SUCCESS) {
      return new Notify(this.mergeUserMessage(userMessage));
    } else {
      return new AddMessage(this.mergeUserMessage(userMessage));
    }
  }

  mergeUserMessage(userMessage: UserMessage): UserMessage {
    return new UserMessage(
      userMessage.status,
      userMessage.message,
      userMessage.data,
      this.mergeOptions(userMessage.options),
    );
  }

  fromError(response: HttpErrorResponse, data?: any, options?: IUserMessageOptions): UserMessage {
    if (this.messageTypeGuard(response.error)) {
      return new UserMessage(
        response.error.status,
        response.error.text,
        Object.assign(Object.assign({}, data), response.error.data),
        this.mergeOptions(options),
      );
    } else {
      return new UserMessage(
        MessageType.FAILED,
        response.message,
        Object.assign(Object.assign({}, data)),
        this.mergeOptions(options),
      );
    }
  }

  actionFromError(response: HttpErrorResponse, data?: any, options?: IUserMessageOptions): Notify | AddMessage {
    return this.userMessageToAction(
      this.fromError(response, data, options),
    );
  }

  messageTypeGuard(obj: any) {
    return obj && obj.status && obj.text;
  }

  private mergeOptions(options: IUserMessageOptions): IUserMessageOptions {
    return Object.assign(Object.assign({}, this.defaultOptions), options);
  }
}

export type NgbAlertType =
  'success' |
  'warning' |
  'info' |
  'danger' |
  'dark';

export type NotificationSeverity = 'success' | 'info' | 'warn' | 'error';
