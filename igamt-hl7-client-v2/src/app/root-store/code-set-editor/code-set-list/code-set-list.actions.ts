import { Action } from '@ngrx/store';
import { ICodeSetListItem } from 'src/app/modules/code-set-editor/models/code-set.models';
import { ISortOptions } from 'src/app/modules/shared/models/sort.class';
export enum CodeSetListActionTypes {
  LoadCodeSetList = '[CodeSetList] Load CodeSet List Items',
  UpdateCodeSetList = '[CodeSetList] Update CodeSet List Items',
  DeleteCodeSetListItemRequest = '[CodeSetList] Delete CodeSet List Item Request',
  DeleteCodeSetListItemSuccess = '[CodeSetList] Delete CodeSet List Item',
  SelectCodeSetListViewType = '[CodeSetList] Select CodeSet List View Type',
  SelectCodeSetListSortOption = '[CodeSetList] Select Sort Option',
  ClearCodeSetList = '[CodeSetList] Clear CodeSet List',
  UpdatePendingInvitationCount = '[CodeSetList] Update Pending Invitation Count',
  CloneCodeSet = '[CodeSetList] Clone Code Set',
  CloneCodeSetSuccess = '[CodeSetList] Clone Code Set Success',
  CloneCodeSetFailure = '[CodeSetList] Clone Code Set Failure',

  PublishCodeSet  =  '[CodeSetList] Clone Code Set',
  PublishCodeSetSuccess  =  '[CodeSetList] Clone Code Set Success',
  PublishCodeSetFailure  =  '[CodeSetList] Clone Code Set Failure',

}

export type CodeSetLoadType = 'PRIVATE' | 'PUBLIC' | 'ALL';

export class LoadCodeSetList implements Action {
  readonly type = CodeSetListActionTypes.LoadCodeSetList;

  constructor(readonly payload: {
    type: CodeSetLoadType,
  }) {
  }
}

export class UpdateCodeSetList implements Action {
  readonly type = CodeSetListActionTypes.UpdateCodeSetList;

  constructor(readonly payload: ICodeSetListItem[]) {
  }
}

export class DeleteCodeSetListItemRequest implements Action {
  readonly type = CodeSetListActionTypes.DeleteCodeSetListItemRequest;

  constructor(readonly id: string) {
  }
}

export class DeleteCodeSetListItemSuccess implements Action {
  readonly type = CodeSetListActionTypes.DeleteCodeSetListItemSuccess;

  constructor(readonly id: string) {
  }
}

export class CloneCodeSetSuccess implements Action {
  readonly type = CodeSetListActionTypes.CloneCodeSetSuccess;

  constructor(readonly payload: ICodeSetListItem) {
  }
}

export class SelectCodeSetListViewType implements Action {
  readonly type = CodeSetListActionTypes.SelectCodeSetListViewType;

  constructor(readonly viewType: CodeSetLoadType) {
  }
}

export class SelectCodeSetListSortOption implements Action {
  readonly type = CodeSetListActionTypes.SelectCodeSetListSortOption;

  constructor(readonly sortOption: ISortOptions) {
  }
}

export class UpdatePendingInvitationCount implements Action {
  readonly type = CodeSetListActionTypes.UpdatePendingInvitationCount;

  constructor(readonly payload: { count: number }) {
  }
}

export class ClearCodeSetList implements Action {
  readonly type = CodeSetListActionTypes.ClearCodeSetList;

  constructor() {
  }
}

export type CodeSetListActions =
  LoadCodeSetList |
  UpdateCodeSetList |
  DeleteCodeSetListItemRequest |
  DeleteCodeSetListItemSuccess |
  ClearCodeSetList |
  SelectCodeSetListViewType |
  SelectCodeSetListSortOption |
  CloneCodeSetSuccess|
  UpdatePendingInvitationCount;
