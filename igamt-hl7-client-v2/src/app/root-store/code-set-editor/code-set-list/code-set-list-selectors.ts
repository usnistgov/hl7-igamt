import { createSelector } from '@ngrx/store';
import { ICodeSetListItem } from 'src/app/modules/code-set-editor/models/code-set.models';
import { ISortOptions } from 'src/app/modules/shared/models/sort.class';
import { selectCodeSetList } from './../code-set.reducer';
import { CodeSetLoadType } from './code-set-list.actions';
import { codeSetListItemAdapter, IState } from './code-set-list.reducer';

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = codeSetListItemAdapter.getSelectors();

export const selectViewType = createSelector(
  selectCodeSetList,
  (state: IState) => {
    return state.viewType;
  },
);

export const selectSortOptions = createSelector(
  selectCodeSetList,
  (state: IState) => {
    return state.sortOptions;
  },
);

export const selectCodeSetPendingInvitations = createSelector(
  selectCodeSetList,
  (state: IState) => {
    return state.pendingInvitations;
  },
);

export const selectLoadedCodeSets = createSelector(
  selectCodeSetList,
  selectAll,
);

export const selectCodeSetListView = createSelector(
  selectLoadedCodeSets,
  selectViewType,
  (workspaceList: ICodeSetListItem[], viewType: CodeSetLoadType) => {
    return workspaceList.filter((item) => {
      return item.type === viewType || (viewType === 'ALL' && item.type === 'PRIVATE');
    });
  },
);

export const selectCodeSetListViewFiltered = createSelector(
  selectCodeSetListView,
  (workspaceList: ICodeSetListItem[], props: any) => {
    return workspaceList.filter((item) => {
      return props.filter && item.title.includes(props.filter) || !props.filter;
    });
  },
);

export const selectCodeSetListViewFilteredAndSorted = createSelector(
  selectCodeSetListViewFiltered,
  selectSortOptions,
  (workspaceList: ICodeSetListItem[], sort: ISortOptions) => {
    return workspaceList
      .slice()
      .sort((elm1, elm2) => {
        const factor: number = elm1[sort.property] < elm2[sort.property] ? -1 : elm2[sort.property] < elm1[sort.property] ? 1 : 0;
        return !sort.ascending ? factor * -1 : factor;
      });
  },
);
