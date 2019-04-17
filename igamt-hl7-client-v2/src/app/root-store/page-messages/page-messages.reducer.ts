import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserMessage } from '../../modules/core/models/message/message.class';
import { PageMessagesActions, PageMessagesActionTypes } from './page-messages.actions';

export interface IState extends EntityState<UserMessage> {
}

export const initialState: IState = {
  entities: {},
  ids: [],
};

const pageMessagesAdapter = createEntityAdapter<UserMessage>();

export function reducer(state = initialState, action: PageMessagesActions): IState {
  switch (action.type) {
    case PageMessagesActionTypes.DeleteMessage:
      return pageMessagesAdapter.removeOne(action.id, state);

    case PageMessagesActionTypes.ClearAll:
      return pageMessagesAdapter.removeAll({ ...state });

    case PageMessagesActionTypes.AddMessage:
      return pageMessagesAdapter.addOne(action.payload, state);

    default:
      return state;
  }
}

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = pageMessagesAdapter.getSelectors();

export const selectPageMessages = createFeatureSelector('pageMessages');
export const selectMessages = createSelector(
  selectPageMessages,
  selectAll,
);
