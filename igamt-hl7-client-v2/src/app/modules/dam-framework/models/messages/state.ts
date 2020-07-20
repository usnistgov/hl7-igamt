import { EntityState } from '@ngrx/entity';
import { UserMessage } from './message.class';

export interface IMessagesState extends EntityState<UserMessage> {
}

export const emptyMessages: IMessagesState = {
  entities: {},
  ids: [],
};
