import { createSelector } from '@ngrx/store';
import { ISortOptions } from 'src/app/modules/shared/models/sort.class';
import { IgListLoad } from 'src/app/root-store/ig/ig-list/ig-list.actions';
import { IgListItem } from './../../../modules/ig/models/ig/ig-list-item.class';
import { selectIgList } from './../ig.reducer';
import { igListItemAdapter, IState } from './ig-list.reducer';

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = igListItemAdapter.getSelectors();

export const selectViewType = createSelector(
  selectIgList,
  (state: IState) => {
    return state.viewType;
  },
);

export const selectSortOptions = createSelector(
  selectIgList,
  (state: IState) => {
    return state.sortOptions;
  },
);

export const selectLoadedIgs = createSelector(
  selectIgList,
  selectAll,
);

export const selectIgListView = createSelector(
  selectLoadedIgs,
  selectViewType,
  (igList: IgListItem[], viewType: IgListLoad) => {
    return igList.filter((item) => {
      return item.type === viewType || (viewType === 'ALL' && item.type === 'USER');
    });
  },
);

export const selectIgListViewFiltered = createSelector(
  selectIgListView,
  (igList: IgListItem[], props: any) => {
    return igList.filter((item) => {
      return props.filter && item.title.includes(props.filter) || !props.filter;
    });
  },
);

export const selectIgListViewFilteredAndSorted = createSelector(
  selectIgListViewFiltered,
  selectSortOptions,
  (igList: IgListItem[], sort: ISortOptions) => {
    return igList
      .slice()
      .sort((elm1, elm2) => {
        const factor: number = elm1[sort.property] < elm2[sort.property] ? -1 : elm2[sort.property] < elm1[sort.property] ? 1 : 0;
        return !sort.ascending ? factor * -1 : factor;
      });
  },
);
