import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { DamWidgetEffect } from '../../modules/dam-framework/store/dam-widget-effect.class';
import { OpenEditor } from '../../modules/dam-framework/store/data/dam.actions';
import { STRUCT_EDIT_WIDGET_ID } from '../../modules/structure-editor/components/structure-editor-container/structure-editor-container.component';
import {
  LoadMessageStructureSuccess,
  LoadSegmentStructureSuccess,
  LoadUserStructuresSuccess,
  StructureEditorActions,
  StructureEditorActionTypes,
} from './structure-editor.actions';

@Injectable()
export class StructureEditorEffects extends DamWidgetEffect {

  @Effect()
  loadStructureEditors$ = this.actions$.pipe(
    ofType(StructureEditorActionTypes.LoadUserStructures),
    concatMap(() => of(new LoadUserStructuresSuccess())),
  );

  @Effect()
  loadMessageStructure$ = this.actions$.pipe(
    ofType(StructureEditorActionTypes.LoadMessageStructure),
    concatMap(() => of(new LoadMessageStructureSuccess())),
  );

  @Effect()
  loadSegmentStructure$ = this.actions$.pipe(
    ofType(StructureEditorActionTypes.LoadSegmentStructure),
    concatMap(() => of(new LoadSegmentStructureSuccess())),
  );

  @Effect()
  openMessageStructureEditor$ = this.actions$.pipe(
    ofType(StructureEditorActionTypes.OpenMessageStructureEditor),
    concatMap(() => of(new OpenEditor({
      id: '1',
      editor: {
        id: '',
        title: '',
      },
      display: {},
      initial: {},
    }))),
  );

  @Effect()
  openSegmentStructureEditor$ = this.actions$.pipe(
    ofType(StructureEditorActionTypes.OpenSegmentStructureEditor),
    concatMap(() => of(new OpenEditor({
      id: '1',
      editor: {
        id: '',
        title: '',
      },
      display: {},
      initial: {},
    }))),
  );

  @Effect()
  openMessageStructureMetadataEditor$ = this.actions$.pipe(
    ofType(StructureEditorActionTypes.OpenMessageStructureMetadataEditor),
    concatMap(() => of(new OpenEditor({
      id: '1',
      editor: {
        id: '',
        title: '',
      },
      display: {},
      initial: {},
    }))),
  );

  @Effect()
  openSegmentStructureMetadataEditor$ = this.actions$.pipe(
    ofType(StructureEditorActionTypes.OpenSegmentStructureMetadataEditor),
    concatMap(() => of(new OpenEditor({
      id: '1',
      editor: {
        id: '',
        title: '',
      },
      display: {},
      initial: {},
    }))),
  );

  constructor(actions$: Actions<StructureEditorActions>) {
    super(STRUCT_EDIT_WIDGET_ID, actions$);
  }

}
