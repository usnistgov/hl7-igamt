import {createSelector} from '@ngrx/store';
import {ISortOptions} from 'src/app/modules/shared/models/sort.class';
import {IgListItem} from '../../../modules/document/models/document/ig-list-item.class';
import {selectLibraryList} from '../library.reducer';
import {LibraryListLoad} from './library-list.actions';
import {igListItemAdapter, IState} from './library-list.reducer';

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = igListItemAdapter.getSelectors();

export const selectViewType = createSelector(
  selectLibraryList,
  (state: IState) => {
    return state.viewType;
  },
);

export const selectSortOptions = createSelector(
  selectLibraryList,
  (state: IState) => {
    return state.sortOptions;
  },
);

export const selectLoadedIgs = createSelector(
  selectLibraryList,
  selectAll,
);

export const selectIgListView = createSelector(
  selectLoadedIgs,
  selectViewType,
  (igList: IgListItem[], viewType: LibraryListLoad) => {
    return igList.filter((item) => {
      return item.type === viewType || (viewType === 'ALL' && item.type === 'USER');
    });
  },
);

// export const selectIgListViewFiltered = createSelector(
//   selectIgListView,
//   (igList: IgListItem[], props: any) => {
//     return igList.filter((item) => {
//       return props.filter && item.title.includes(props.filter) || !props.filter;
//     });
//   },
// );

// export const selectIgListViewFilteredAndSorted = createSelector(
//   selectIgListViewFiltered,
//   selectSortOptions,
//   (igList: IgListItem[], sort: ISortOptions) => {
//     console.log(igList);
//     return igList
//       .slice()
//       .sort((elm1, elm2) => {
//         const factor: number = elm1[sort.property] < elm2[sort.property] ? -1 : elm2[sort.property] < elm1[sort.property] ? 1 : 0;
//         return !sort.ascending ? factor * -1 : factor;
//       });
//   },
// );

export const selectIgListViewFiltered = createSelector(
  selectIgListView,
  (igList: IgListItem[], props: any) => {
    return igList.filter((item) => {
      return props.filter && item.title.includes(props.filter) || !props.filter && (!item.deprecated || props.deprecated) &&  (!props.status || !props.status.length || props.status.indexOf(item['status']) > -1 ) ;
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
