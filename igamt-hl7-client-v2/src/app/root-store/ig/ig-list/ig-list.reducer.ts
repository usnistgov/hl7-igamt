import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { IgListItem } from 'src/app/modules/ig/models/ig/ig-list-item.class';
import { ISortOptions } from 'src/app/modules/shared/models/sort.class';
import { IgListActions, IgListActionTypes, IgListLoad } from './ig-list.actions';

export interface IState extends EntityState<IgListItem> {
  viewType: IgListLoad;
  sortOptions: ISortOptions;
}

export const initialState: IState = {
  entities: {},
  ids: [],
  viewType: 'USER',
  sortOptions: {
    property: 'title',
    ascending: true,
  },
};

export const igListItemAdapter = createEntityAdapter<IgListItem>();

export function reducer(state = initialState, action: IgListActions): IState {
  switch (action.type) {

    case IgListActionTypes.UpdateIgList:
      return igListItemAdapter.upsertMany(action.payload, state);

    case IgListActionTypes.DeleteIgListItemSuccess:
      return igListItemAdapter.removeOne(action.id, state);

    case IgListActionTypes.SelectIgListViewType:
      return {
        ...state,
        viewType: action.viewType,
      };

    case IgListActionTypes.SelectIgListSortOption:
      return {
        ...state,
        sortOptions: action.sortOption,
      };

    default:
      return state;
  }
}
