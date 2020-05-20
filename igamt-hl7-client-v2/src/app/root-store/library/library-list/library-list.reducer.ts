import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { ISortOptions } from 'src/app/modules/shared/models/sort.class';
import {IgListItem} from '../../../modules/document/models/document/ig-list-item.class';
import { LibraryListActions, LibraryListActionTypes, LibraryListLoad } from './library-list.actions';

export interface IState extends EntityState<IgListItem> {
  viewType: LibraryListLoad;
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

export function reducer(state = initialState, action: LibraryListActions): IState {
  switch (action.type) {

    case LibraryListActionTypes.ClearLibraryList:
      return {
        ...initialState,
        sortOptions: {
          ...state.sortOptions,
        },
      };
    case LibraryListActionTypes.UpdateLibraryList:
    {
      return igListItemAdapter.addAll(action.payload, state);
    }
      case LibraryListActionTypes.DeleteLibraryListItemSuccess:
      return igListItemAdapter.removeOne(action.id, state);

    case LibraryListActionTypes.SelectLibraryListViewType:
      return {
        ...state,
        viewType: action.viewType,
      };

    case LibraryListActionTypes.SelectLibraryListSortOption:
      return {
        ...state,
        sortOptions: action.sortOption,
      };

    default:
      return state;
  }
}
