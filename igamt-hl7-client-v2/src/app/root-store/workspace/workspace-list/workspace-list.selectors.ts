import { WorkspaceLoadType } from './workspace-list.actions';
import { IWorkspaceListItem } from './../../../modules/shared/models/workspace-list-item.interface';
import {createSelector} from '@ngrx/store';
import {ISortOptions} from 'src/app/modules/shared/models/sort.class';
import {selectWorkspaceList} from './../workspace.reducer';
import {workspaceListItemAdapter, IState} from './workspace-list.reducer';

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = workspaceListItemAdapter.getSelectors();

export const selectViewType = createSelector(
  selectWorkspaceList,
  (state: IState) => {
    return state.viewType;
  },
);

export const selectSortOptions = createSelector(
  selectWorkspaceList,
  (state: IState) => {
    return state.sortOptions;
  },
);

export const selectLoadedWorkspaces = createSelector(
  selectWorkspaceList,
  selectAll,
);

export const selectWorkspaceListView = createSelector(
  selectLoadedWorkspaces,
  selectViewType,
  (workspaceList: IWorkspaceListItem[], viewType: WorkspaceLoadType) => {
    return workspaceList.filter((item) => {
      return item.type === viewType || (viewType === 'ALL' && item.type === 'PRIVATE');
    });
  },
);

export const selectWorkspaceListViewFiltered = createSelector(
  selectWorkspaceListView,
  (workspaceList: IWorkspaceListItem[], props: any) => {
    return workspaceList.filter((item) => {
      return props.filter && item.title.includes(props.filter) || !props.filter;
    });
  },
);

export const selectWorkspaceListViewFilteredAndSorted = createSelector(
  selectWorkspaceListViewFiltered,
  selectSortOptions,
  (workspaceList: IWorkspaceListItem[], sort: ISortOptions) => {
    return workspaceList
      .slice()
      .sort((elm1, elm2) => {
        const factor: number = elm1[sort.property] < elm2[sort.property] ? -1 : elm2[sort.property] < elm1[sort.property] ? 1 : 0;
        return !sort.ascending ? factor * -1 : factor;
      });
  },
);
