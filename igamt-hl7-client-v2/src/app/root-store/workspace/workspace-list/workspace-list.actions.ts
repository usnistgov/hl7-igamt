import { IWorkspaceListItem } from './../../../modules/shared/models/workspace-list-item.interface';
import { Action } from '@ngrx/store';
import { ISortOptions } from 'src/app/modules/shared/models/sort.class';
export enum  WorkspaceListActionTypes {
  LoadWorkspaceList = '[WorkspaceList] Load Workspace List Items',
  UpdateWorkspaceList = '[WorkspaceList] Update Workspace List Items',
  DeleteWorkspaceListItemRequest = '[WorkspaceList] Delete Workspace List Item Request',
  DeleteWorkspaceListItemSuccess = '[WorkspaceList] Delete Workspace List Item',
  SelectWorkspaceListViewType = '[WorkspaceList] Select Workspace List View Type',
  SelectWorkspaceListSortOption = '[WorkspaceList] Select Sort Option',
  ClearWorkspaceList = '[WorkspaceList] Clear Workspace List',
}

export type WorkspaceLoadType = 'PRIVATE' | 'DISCOVERABLE' | 'PUBLIC' |'ALL';

export class LoadWorkspaceList implements Action {
  readonly type = WorkspaceListActionTypes.LoadWorkspaceList;

  constructor(readonly payload: {
    type: WorkspaceLoadType,
  }) {
  }
}

export class UpdateWorkspaceList implements Action {
  readonly type = WorkspaceListActionTypes.UpdateWorkspaceList;

  constructor(readonly payload: IWorkspaceListItem[]) {
  }
}

export class DeleteWorkspaceListItemRequest implements Action {
  readonly type = WorkspaceListActionTypes.DeleteWorkspaceListItemRequest;

  constructor(readonly id: string) {
  }
}

export class DeleteWorkspaceListItemSuccess implements Action {
  readonly type = WorkspaceListActionTypes.DeleteWorkspaceListItemSuccess;

  constructor(readonly id: string) {
  }
}

export class SelectWorkspaceListViewType implements Action {
  readonly type = WorkspaceListActionTypes.SelectWorkspaceListViewType;

  constructor(readonly viewType: WorkspaceLoadType) {
  }
}

export class SelectWorkspaceListSortOption implements Action {
  readonly type = WorkspaceListActionTypes.SelectWorkspaceListSortOption;

  constructor(readonly sortOption: ISortOptions) {
  }
}

export class ClearWorkspaceList implements Action {
  readonly type = WorkspaceListActionTypes.ClearWorkspaceList;

  constructor() {
  }
}

export type WorkspaceListActions =
  LoadWorkspaceList |
  UpdateWorkspaceList |
  DeleteWorkspaceListItemRequest |
  DeleteWorkspaceListItemSuccess |
  ClearWorkspaceList |
  SelectWorkspaceListViewType |
  SelectWorkspaceListSortOption;
