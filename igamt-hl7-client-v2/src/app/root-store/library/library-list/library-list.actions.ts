import { Action } from '@ngrx/store';
import { ISortOptions } from 'src/app/modules/shared/models/sort.class';
import {IgListItem} from '../../../modules/document/models/document/ig-list-item.class';

export enum LibraryListActionTypes {
  LoadLibraryList = '[LibraryList] Load Library List Items',
  UpdateLibraryList = '[LibraryList] Update Library List Items',
  DeleteLibraryListItemRequest = '[Library] Delete Library List Item Request',
  DeleteLibraryListItemSuccess = '[LibraryList] Delete Library List Item',
  SelectLibraryListViewType = '[LibraryList] Select Library List View Type',
  SelectLibraryListSortOption = '[LibraryList] Select Sort Option',
  ClearLibraryList = '[LibraryList] Clear Library List',
}

export type LibraryListLoad = 'USER' | 'PUBLISHED' | 'SHARED' |'ALL';

export class LoadLibraryList implements Action {
  readonly type = LibraryListActionTypes.LoadLibraryList;

  constructor(readonly payload: {
    type: LibraryListLoad,
  }) {
  }
}

export class UpdateLibraryList implements Action {
  readonly type = LibraryListActionTypes.UpdateLibraryList;

  constructor(readonly payload: IgListItem[]) {
  }
}

export class DeleteLibraryListItemRequest implements Action {
  readonly type = LibraryListActionTypes.DeleteLibraryListItemRequest;

  constructor(readonly id: string) {
  }
}

export class DeleteLibraryListItemSuccess implements Action {
  readonly type = LibraryListActionTypes.DeleteLibraryListItemSuccess;

  constructor(readonly id: string) {
  }
}

export class SelectLibraryListViewType implements Action {
  readonly type = LibraryListActionTypes.SelectLibraryListViewType;

  constructor(readonly viewType: LibraryListLoad) {
  }
}

export class SelectLibraryListSortOption implements Action {
  readonly type = LibraryListActionTypes.SelectLibraryListSortOption;

  constructor(readonly sortOption: ISortOptions) {
  }
}

export class ClearLibraryList implements Action {
  readonly type = LibraryListActionTypes.ClearLibraryList;

  constructor() {
  }
}

export type LibraryListActions =
  LoadLibraryList |
  UpdateLibraryList |
  DeleteLibraryListItemRequest |
  DeleteLibraryListItemSuccess |
  ClearLibraryList |
  SelectLibraryListViewType |
  SelectLibraryListSortOption;
