import {HttpErrorResponse} from '@angular/common/http';
import { Action } from '@ngrx/store';
import {IEditorMetadata} from '../../modules/shared/models/editor.enum';
import {IValueSet} from '../../modules/shared/models/value-set.interface';

export enum ValueSetEditActionTypes {
  LoadValueSet = '[ValueSet Edit] Load Value Set',
  LoadValueSetSuccess = '[ValueSet Edit] Load Value Set Success',
  LoadValueSetFailure = '[ValueSet Edit] Load Value Set Failure',
  OpenValueSetPreDefEditor = '[ValueSet Edit] Open Value Set PreDef Editor',
  OpenValueSetPostDefEditor = '[ValueSet Edit] Open Value set PostDef Editor',
  OpenValueSetStructureEditor = '[ValueSet Edit] Open Value Set Structure Editor',
  OpenValueSetCrossRefEditor = '[ValueSet Edit]Open Value Set Cross References Editor',
  OpenValueSetMetadataEditor = '[ValueSet Edit] Open Value Set Metadata Editor',
  OpenValueSetDeltaEditor = '[ValueSet Edit] Open Value Set Delta Editor'
}

export class LoadValueSet implements Action {
  readonly type = ValueSetEditActionTypes.LoadValueSet;
  constructor(readonly id: string) {
  }
}

export class LoadValueSetSuccess implements Action {
  readonly type = ValueSetEditActionTypes.LoadValueSetSuccess;
  constructor(readonly valueSet: IValueSet) { }

}

export class LoadValueSetFailure implements Action {
  readonly type = ValueSetEditActionTypes.LoadValueSetFailure;
  constructor(readonly error: HttpErrorResponse) { }
}

export class OpenValueSetMetadataEditor implements Action {
  readonly type = ValueSetEditActionTypes.OpenValueSetMetadataEditor;
  constructor(readonly payload: {
    id: string,
    editor: IEditorMetadata,
  }) { }

}

export class OpenValueSetStructureEditor implements Action {
  readonly type = ValueSetEditActionTypes.OpenValueSetStructureEditor;
  constructor(readonly payload: {
    id: string,
    editor: IEditorMetadata,
  }) { }
}

export class OpenValueSetPreDefEditor implements Action {
  readonly type = ValueSetEditActionTypes.OpenValueSetPreDefEditor;
  constructor(readonly payload: {
    id: string,
    editor: IEditorMetadata,
  }) { }
}

export class OpenValueSetPostDefEditor implements Action {
  readonly type = ValueSetEditActionTypes.OpenValueSetPostDefEditor;
  constructor(readonly payload: {
    id: string,
    editor: IEditorMetadata,
  }) { }
}

export class OpenValueSetCrossRefEditor implements Action {
  readonly type = ValueSetEditActionTypes.OpenValueSetCrossRefEditor;
  constructor(readonly payload: {
    id: string,
    editor: IEditorMetadata,
  }) { }
}

export class OpenValueSetDeltaEditor implements Action {
  readonly type = ValueSetEditActionTypes.OpenValueSetDeltaEditor;
  constructor(readonly payload: {
    id: string,
    editor: IEditorMetadata,
  }) { }
}

export type ValueSetEditActions = LoadValueSet | LoadValueSetSuccess | LoadValueSetFailure | OpenValueSetPreDefEditor |OpenValueSetMetadataEditor | OpenValueSetStructureEditor | OpenValueSetPostDefEditor | OpenValueSetCrossRefEditor | OpenValueSetDeltaEditor;