import { createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserMessage } from '../../models/messages/message.class';

export const messageFeatureName = 'damf-messages';
export const selectPageMessages = createFeatureSelector(messageFeatureName);

export const pageMessagesAdapter = createEntityAdapter<UserMessage>();
const {
  selectAll,
} = pageMessagesAdapter.getSelectors();

export const selectMessages = createSelector(
  selectPageMessages,
  selectAll,
);
