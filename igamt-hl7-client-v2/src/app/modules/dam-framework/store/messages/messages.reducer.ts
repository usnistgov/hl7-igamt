import { emptyMessages, IMessagesState } from '../../models/messages/state';
import { MessagesActions, MessagesActionTypes } from './messages.actions';
import { pageMessagesAdapter } from './messages.selectors';

export const messagesInitialState: IMessagesState = emptyMessages;

export function messagesReducer(state = messagesInitialState, action: MessagesActions): IMessagesState {
  switch (action.type) {
    case MessagesActionTypes.DeleteMessage:
      return pageMessagesAdapter.removeOne(action.id, state);

    case MessagesActionTypes.ClearAll:
      return pageMessagesAdapter.removeAll({ ...state });

    case MessagesActionTypes.AddMessage:
      return pageMessagesAdapter.addOne(action.payload, state);

    default:
      return state;
  }
}
