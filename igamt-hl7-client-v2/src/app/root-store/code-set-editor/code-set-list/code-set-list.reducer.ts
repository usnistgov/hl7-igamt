import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { ISortOptions } from 'src/app/modules/shared/models/sort.class';
import { CodeSetListActions, CodeSetListActionTypes, CodeSetLoadType } from './code-set-list.actions';
import { ICodeSetListItem } from 'src/app/modules/code-set-editor/models/code-set.models';

export interface IState extends EntityState<ICodeSetListItem> {
  viewType: CodeSetLoadType;
  sortOptions: ISortOptions;
  pendingInvitations: number;
}

export const initialState: IState = {
  entities: {},
  ids: [],
  viewType: 'PRIVATE',
  pendingInvitations: 0,
  sortOptions: {
    property: 'dateUpdated',
    ascending: false,
  },
};

export const codeSetListItemAdapter = createEntityAdapter<ICodeSetListItem>();

export function reducer(state = initialState, action: CodeSetListActions): IState {
  switch (action.type) {

    case CodeSetListActionTypes.ClearCodeSetList:
      return {
        ...initialState,
        sortOptions: {
          ...state.sortOptions,
        },
      };
    case CodeSetListActionTypes.UpdateCodeSetList:
      {
        return codeSetListItemAdapter.addAll(action.payload, state);
      }
    case CodeSetListActionTypes.DeleteCodeSetListItemSuccess:
      return codeSetListItemAdapter.removeOne(action.id, state);

    case CodeSetListActionTypes.SelectCodeSetListViewType:
      return {
        ...state,
        viewType: action.viewType,
      };

    case CodeSetListActionTypes.SelectCodeSetListSortOption:
      return {
        ...state,
        sortOptions: action.sortOption,
      };

    case CodeSetListActionTypes.UpdatePendingInvitationCount:
      return {
        ...state,
        pendingInvitations: action.payload.count,
      };

    default:
      return state;
  }
}
