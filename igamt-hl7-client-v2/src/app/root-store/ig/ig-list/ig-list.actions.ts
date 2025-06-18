import { Action } from '@ngrx/store';
import { ISortOptions } from 'src/app/modules/shared/models/sort.class';
import {IgListItem} from '../../../modules/document/models/document/ig-list-item.class';
export enum IgListActionTypes {
  LoadIgList = '[IgList] Load Ig List Items',
  UpdateIgList = '[IgList] Update Ig List Items',
  DeleteIgListItemRequest = '[IgList] Delete Ig List Item Request',
  DeleteIgListItemSuccess = '[IgList] Delete Ig List Item',
  SelectIgListViewType = '[IgList] Select Ig List View Type',
  SelectIgListSortOption = '[IgList] Select Sort Option',
  ClearIgList = '[IgList] Clear Ig List',
  LockIG = '[IgList] Lock Ig  Request',
  LockIGSuccess = '[IgList] Lock Ig Success',
}

export type IgListLoad = 'USER' | 'PUBLISHED' | 'SHARED' | 'ALL';

export class LoadIgList implements Action {
  readonly type = IgListActionTypes.LoadIgList;

  constructor(readonly payload: {
    type: IgListLoad,
  }) {
  }
}

export class UpdateIgList implements Action {
  readonly type = IgListActionTypes.UpdateIgList;

  constructor(readonly payload: IgListItem[]) {
  }
}

export class DeleteIgListItemRequest implements Action {
  readonly type = IgListActionTypes.DeleteIgListItemRequest;

  constructor(readonly id: string) {
  }
}

export class DeleteIgListItemSuccess implements Action {
  readonly type = IgListActionTypes.DeleteIgListItemSuccess;

  constructor(readonly id: string) {
  }
}

export class LockIG implements Action {
  readonly type = IgListActionTypes.LockIG;

  constructor(readonly id: string) {
  }
}

export class LockIGSuccess implements Action {
  readonly type = IgListActionTypes.LockIGSuccess;

  constructor(readonly id: string) {
  }
}

export class SelectIgListViewType implements Action {
  readonly type = IgListActionTypes.SelectIgListViewType;

  constructor(readonly viewType: IgListLoad) {
  }
}

export class SelectIgListSortOption implements Action {
  readonly type = IgListActionTypes.SelectIgListSortOption;

  constructor(readonly sortOption: ISortOptions) {
  }
}

export class ClearIgList implements Action {
  readonly type = IgListActionTypes.ClearIgList;

  constructor() {
  }
}

export type IgListActions =
  LoadIgList |
  UpdateIgList |
  DeleteIgListItemRequest |
  DeleteIgListItemSuccess |
  ClearIgList |
  SelectIgListViewType |
  SelectIgListSortOption |
  LockIG |
  LockIGSuccess;
