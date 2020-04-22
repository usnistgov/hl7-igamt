import { Action } from '@ngrx/store';
import { IDamResource } from '../models/state/repository';
import { IEditorMetadata } from '../models/state/workspace';

export enum DamActionTypes {
  LoadPayloadData = '[DAMF State] Load Payload Data',
  OpenEditor = '[DAMF Editor] Open Editor',
  OpenEditorFailure = '[DAMF Editor] Open Editor Failure',
  EditorChange = '[DAMF Editor] Register Change Data',
  EditorReset = '[DAMF Editor] Reset Data',
  GlobalSave = '[DAMF Editor] Toolbar Global Save Button',
  EditorSave = '[DAMF Editor] Editor Save',
  EditorSaveSuccess = '[DAMF Editor] Editor Save Success',
  EditorSaveFailure = '[DAMF Editor] Editor Save Failure',
  EditorUpdate = '[DAMF Editor] Update editor without changes',
  UpdateActiveResource = '[DAMF Editor] Update Active Resource Display',
  SetValue = '[DAMF State] Set State Value',
  LoadForRouteSuccess = '[DAMF Route] Load Data For Route Success',
  LoadForRouteFailure = '[DAMF Route] Load Data For Route Failure',
  LoadResourcesInRepostory = '[DAMF Repository] Load Resources In Repository',
  InsertResourcesInRepostory = '[DAMF Repository] Insert Resources In Repository',
  DeleteResourcesFromRepostory = '[DAMF Repository] Delete Resources From Repository',
  ClearRepository = '[DAMF Repository] Clear Repository',
  CollapseSideBar = '[DAMF Layout] Collapse Side Bar',
  ExpandSideBar = '[DAMF Layout] Expand Side Bar',
  ToggleFullScreen = '[DAMF Layout] Toggle Fullscreen',
}

export class LoadPayloadData implements Action {
  readonly type = DamActionTypes.LoadPayloadData;
  constructor(readonly payload: any) {
  }
}

export abstract class OpenEditorBase implements Action {
  readonly type: string;
  readonly payload: {
    id: string,
    editor: IEditorMetadata,
  };

  constructor() {
  }
}

export class OpenEditor implements Action {
  readonly type = DamActionTypes.OpenEditor;

  constructor(readonly payload: {
    id: string,
    display: any,
    editor: IEditorMetadata,
    initial: any,
  }) {
  }
}

export class OpenEditorFailure implements Action {
  readonly type = DamActionTypes.OpenEditorFailure;

  constructor(readonly payload: {
    id: string,
  }) {
  }
}

export class EditorChange implements Action {
  readonly type = DamActionTypes.EditorChange;

  constructor(readonly payload: {
    data: any;
    valid: boolean;
    date: Date;
  }) {
  }
}

export class EditorReset implements Action {
  readonly type = DamActionTypes.EditorReset;

  constructor() {
  }
}

export class GlobalSave implements Action {
  readonly type = DamActionTypes.GlobalSave;

  constructor() {
  }
}

export class EditorSave implements Action {
  readonly type = DamActionTypes.EditorSave;

  constructor(readonly payload?: any) {
  }
}

export class EditorUpdate implements Action {
  readonly type = DamActionTypes.EditorUpdate;
  constructor(readonly payload: {
    value: any,
    updateDate: boolean,
  }) { }
}

export class EditorSaveSuccess implements Action {
  readonly type = DamActionTypes.EditorSaveSuccess;

  constructor(readonly current?: any) {
  }
}

export class EditorSaveFailure implements Action {
  readonly type = DamActionTypes.EditorSaveFailure;

  constructor() {
  }
}

export class UpdateActiveResource implements Action {
  readonly type = DamActionTypes.UpdateActiveResource;

  constructor(readonly payload: any) { }
}

export class SetValue implements Action {
  readonly type = DamActionTypes.SetValue;

  constructor(readonly payload: any) { }
}

export class LoadResourcesInRepostory implements Action {
  readonly type = DamActionTypes.LoadResourcesInRepostory;

  constructor(readonly payload: {
    collections: Array<{
      key: string,
      values: IDamResource[],
    }>,
  }) { }
}

export class InsertResourcesInRepostory implements Action {
  readonly type = DamActionTypes.InsertResourcesInRepostory;

  constructor(readonly payload: {
    collections: Array<{
      key: string,
      values: IDamResource[],
    }>,
  }) { }
}

export class DeleteResourcesFromRepostory implements Action {
  readonly type = DamActionTypes.DeleteResourcesFromRepostory;

  constructor(readonly payload: {
    collections: Array<{
      key: string,
      values: string[],
    }>,
  }) { }
}

export class ClearRepository implements Action {
  readonly type = DamActionTypes.ClearRepository;

  constructor(readonly payload: {
    all: boolean,
    collections?: string[],
  }) { }
}

export class LoadForRouteSuccess implements Action {
  readonly type = DamActionTypes.LoadForRouteSuccess;

  constructor(readonly payload: {
    collection: string,
    resource: IDamResource,
  }) { }
}

export class LoadForRouteFailure implements Action {
  readonly type = DamActionTypes.LoadForRouteFailure;

  constructor() { }
}

export class CollapseSideBar implements Action {
  readonly type = DamActionTypes.CollapseSideBar;
  constructor() {
  }
}

export class ExpandSideBar implements Action {
  readonly type = DamActionTypes.ExpandSideBar;

  constructor() {
  }

}

export class ToggleFullScreen implements Action {
  readonly type = DamActionTypes.ToggleFullScreen;
  constructor() {
  }
}

export type DamActions =
  LoadPayloadData |
  OpenEditor |
  OpenEditorFailure |
  EditorChange |
  EditorReset |
  EditorSave |
  EditorSaveSuccess |
  EditorSaveFailure |
  EditorUpdate |
  UpdateActiveResource |
  SetValue |
  LoadResourcesInRepostory |
  InsertResourcesInRepostory |
  ClearRepository |
  LoadForRouteSuccess |
  GlobalSave |
  LoadForRouteFailure |
  CollapseSideBar |
  ExpandSideBar |
  DeleteResourcesFromRepostory |
  ToggleFullScreen;
