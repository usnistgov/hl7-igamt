import { InjectionToken } from '@angular/core';
import { IUserMessageOptions } from './models/messages/message.class';

export const DEFAULT_MESSAGE_OPTION: InjectionToken<IUserMessageOptions> = new InjectionToken<IUserMessageOptions>('USER_MESSAGE_TOKEN');
