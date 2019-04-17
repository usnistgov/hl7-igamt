import { InjectionToken } from '@angular/core';
import { IUserMessageOptions } from '../core/models/message/message.class';

export const DEFAULT_MESSAGE_OPTION: InjectionToken<IUserMessageOptions> = new InjectionToken<IUserMessageOptions>('USER_MESSAGE_TOKEN');
