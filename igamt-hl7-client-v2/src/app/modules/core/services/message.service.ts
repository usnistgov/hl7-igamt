import { HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MessageType, UserMessage } from 'src/app/modules/core/models/message/message.class';
import { Notify } from 'src/app/root-store/notification/notification.actions';
import { DEFAULT_MESSAGE_OPTION } from '../../shared/shared-injection-token';
import { AddMessage } from './../../../root-store/page-messages/page-messages.actions';
import { IUserMessageOptions, Message } from './../models/message/message.class';

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  constructor(@Inject(DEFAULT_MESSAGE_OPTION) private defaultOptions: IUserMessageOptions) { }

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

  private mergeOptions(options: IUserMessageOptions): IUserMessageOptions {
    return Object.assign(Object.assign({}, this.defaultOptions), options);
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

  userMessageToAction(userMessage: UserMessage): Notify | AddMessage {
    if (userMessage.status === MessageType.SUCCESS) {
      return new Notify(userMessage);
    } else {
      return new AddMessage(userMessage);
    }
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
}

export type NgbAlertType =
  'success' |
  'warning' |
  'info' |
  'danger' |
  'dark';

export type NotificationSeverity = 'success' | 'info' | 'warn' | 'error';
