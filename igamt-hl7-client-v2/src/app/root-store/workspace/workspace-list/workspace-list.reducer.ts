import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { ISortOptions } from 'src/app/modules/shared/models/sort.class';
import { IWorkspaceListItem } from '../../../modules/shared/models/workspace-list-item.interface';
import { WorkspaceListActions, WorkspaceListActionTypes, WorkspaceLoadType } from './workspace-list.actions';

export interface IState extends EntityState<IWorkspaceListItem> {
  viewType: WorkspaceLoadType;
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

export const workspaceListItemAdapter = createEntityAdapter<IWorkspaceListItem>();

export function reducer(state = initialState, action: WorkspaceListActions): IState {
  switch (action.type) {

    case WorkspaceListActionTypes.ClearWorkspaceList:
      return {
        ...initialState,
        sortOptions: {
          ...state.sortOptions,
        },
      };
    case WorkspaceListActionTypes.UpdateWorkspaceList:
      {
        return workspaceListItemAdapter.addAll(action.payload, state);
      }
    case WorkspaceListActionTypes.DeleteWorkspaceListItemSuccess:
      return workspaceListItemAdapter.removeOne(action.id, state);

    case WorkspaceListActionTypes.SelectWorkspaceListViewType:
      return {
        ...state,
        viewType: action.viewType,
      };

    case WorkspaceListActionTypes.SelectWorkspaceListSortOption:
      return {
        ...state,
        sortOptions: action.sortOption,
      };

    case WorkspaceListActionTypes.UpdatePendingInvitationCount:
      return {
        ...state,
        pendingInvitations: action.payload.count,
      };

    default:
      return state;
  }
}
