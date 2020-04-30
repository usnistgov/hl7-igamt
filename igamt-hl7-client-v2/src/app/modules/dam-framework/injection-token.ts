import { InjectionToken } from '@angular/core';
import { IUserMessageOptions } from './models/messages/message.class';
import { IAuthenticationURL } from './services/authentication.service';

export const DEFAULT_MESSAGE_OPTION: InjectionToken<IUserMessageOptions> = new InjectionToken<IUserMessageOptions>('USER_MESSAGE_TOKEN');
export const DAM_AUTH_CONFIG: InjectionToken<IAuthenticationURL> = new InjectionToken<IAuthenticationURL>('AUTH_CONFIG');
