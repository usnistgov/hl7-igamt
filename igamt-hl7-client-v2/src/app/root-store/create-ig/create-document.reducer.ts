import {createFeatureSelector, createSelector} from '@ngrx/store';
import {EventTreeData, MessageEventTreeNode} from '../../modules/document/models/message-event/message-event.class';
import {CreateDocumentActions, CreateDocumentActionTypes} from './create-document.actions';

export interface IState {
  loadedMessageEvents: MessageEventTreeNode[];
  selected: EventTreeData[];
}

export const initialState: IState = {
  loadedMessageEvents: [],
  selected: [],
};

export function reducer(state = initialState, action: CreateDocumentActions): IState {
  if (action.type === CreateDocumentActionTypes.LoadMessageEventsSuccess) {
    return {...state, loadedMessageEvents: action.payload.data};
  } else {
    return state;
  }
}

export const getCreateIgState = createFeatureSelector<IState>('createIg');

export const getLoadedMessageEventsState = createSelector(
  getCreateIgState,
  (state: IState) => state.loadedMessageEvents,
);

export const getSelectedMessages = createSelector(
  getCreateIgState,
  (state: IState) => state.selected,
);
