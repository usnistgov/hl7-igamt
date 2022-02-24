import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, of } from 'rxjs';
import { catchError, concatMap, flatMap, map, take } from 'rxjs/operators';
import * as fromDamActions from 'src/app/modules/dam-framework/store/data/dam.actions';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { DamWidgetEffect } from '../../modules/dam-framework/store/dam-widget-effect.class';
import { LoadResourcesInRepostory, OpenEditor } from '../../modules/dam-framework/store/data/dam.actions';
import { Type } from '../../modules/shared/constants/type.enum';
import { EditorID } from '../../modules/shared/models/editor.enum';
import { STRUCT_EDIT_WIDGET_ID } from '../../modules/structure-editor/components/structure-editor-container/structure-editor-container.component';
import { StructureEditorService } from '../../modules/structure-editor/services/structure-editor.service';
import { LoadResourceReferencesSuccess } from '../dam-igamt/igamt.loaded-resources.actions';
import { LoadMessageStructure, LoadMessageStructureFailure, LoadSegmentStructure, LoadSegmentStructureFailure, LoadUserStructuresFailure, OpenMessageStructureMetadataEditor, OpenSegmentStructureEditor, OpenSegmentStructureMetadataEditor } from './structure-editor.actions';
import {
  LoadMessageStructureSuccess,
  LoadSegmentStructureSuccess,
  LoadUserStructuresSuccess,
  StructureEditorActions,
  StructureEditorActionTypes,
} from './structure-editor.actions';
import { selectMessageStructureById, selectSegmentStructureById } from './structure-editor.reducer';

@Injectable()
export class StructureEditorEffects extends DamWidgetEffect {

  @Effect()
  loadStructureEditors$ = this.actions$.pipe(
    ofType(StructureEditorActionTypes.LoadUserStructures),
    concatMap(() => {

      return this.structureEditorService.getRegistry().pipe(
        flatMap((registry) => {
          return [
            new fromDAM.LoadPayloadData({
              id: 'virtual-document',
              type: Type.CUSTOM_STRUCTURE_EDITOR,
              registry,
            }),
            new fromDAM.LoadResourcesInRepostory({
              collections: [
                {
                  key: 'message-structures',
                  values: registry.messageStructureRegistry || [],
                },
                {
                  key: 'segment-structures',
                  values: registry.segmentStructureRegistry || [],
                },
              ],
            }),
            new LoadUserStructuresSuccess(),
          ];
        }),
        catchError((error) => {
          return of(new LoadUserStructuresFailure());
        }),
      );
    }),
  );

  @Effect()
  loadMessageStructure$ = this.actions$.pipe(
    ofType(StructureEditorActionTypes.LoadMessageStructure),
    concatMap((action: LoadMessageStructure) => {
      return this.structureEditorService.getMessageStructureById(action.id).pipe(
        flatMap((ms) => {
          return [
            new fromDAM.SetValue({
              selected: ms,
            }),
            new LoadMessageStructureSuccess(),
          ];
        }),
        catchError((error) => {
          return of(new LoadMessageStructureFailure());
        }),
      );
    }),
  );

  @Effect()
  loadSegmentStructure$ = this.actions$.pipe(
    ofType(StructureEditorActionTypes.LoadSegmentStructure),
    concatMap((action: LoadSegmentStructure) => {
      return this.structureEditorService.getSegmentById(action.id).pipe(
        flatMap((ss) => {
          return [
            new fromDAM.SetValue({
              selected: ss,
            }),
            new LoadSegmentStructureSuccess(),
          ];
        }),
        catchError((error) => {
          return of(new LoadSegmentStructureFailure());
        }),
      );
    }),
  );

  @Effect()
  openMessageStructureEditor$ = this.actions$.pipe(
    ofType(StructureEditorActionTypes.OpenMessageStructureEditor),
    concatMap((action: OpenMessageStructureMetadataEditor) => {
      return combineLatest(
        this.structureEditorService.getMessageStructureStateById(action.payload.id),
        this.store.select(selectMessageStructureById, { id: action.payload.id }),
      ).pipe(
        take(1),
        flatMap(([ms, display]) => {
          return [
            new LoadResourceReferencesSuccess(ms.resources, {
              resourceType: Type.CONFORMANCEPROFILE,
              id: action.payload.id,
            }),
            new LoadResourcesInRepostory({
              collections: [{
                key: 'datatypes',
                values: ms.datatypes,
              }, {
                key: 'segments',
                values: ms.segments,
              }, {
                key: 'valueSets',
                values: ms.valuesets,
              },
              {
                key: 'resources',
                values: ms.resources,
              },
              ],
            }),
            new OpenEditor({
              id: action.payload.id,
              editor: {
                id: EditorID.CONFP_CUSTOM_STRUCTURE,
                title: 'Structure',
              },
              display,
              initial: {
                ...ms.structure,
                type: Type.MESSAGESTRUCT,
              },
            }),
          ];
        }),
      );
    }),
  );

  @Effect()
  openSegmentStructureEditor$ = this.actions$.pipe(
    ofType(StructureEditorActionTypes.OpenSegmentStructureEditor),
    concatMap((action: OpenSegmentStructureEditor) => {
      return combineLatest(
        this.structureEditorService.getSegmentStateById(action.payload.id),
        this.store.select(selectSegmentStructureById, { id: action.payload.id }),
      ).pipe(
        take(1),
        flatMap(([ss, display]) => {
          return [
            new LoadResourceReferencesSuccess(ss.resources, {
              resourceType: Type.CONFORMANCEPROFILE,
              id: action.payload.id,
            }),
            new LoadResourcesInRepostory({
              collections: [{
                key: 'datatypes',
                values: ss.datatypes,
              }, {
                key: 'valueSets',
                values: ss.valuesets,
              },
              {
                key: 'resources',
                values: ss.resources,
              },
              ],
            }),
            new OpenEditor({
              id: action.payload.id,
              editor: {
                id: EditorID.SEGMENT_CUSTOM_STRUCTURE,
                title: 'Structure',
              },
              display,
              initial: {
                ...ss.structure,
              },
            }),
          ];
        }),
      );
    }),
  );

  @Effect()
  openMessageStructureMetadataEditor$ = this.actions$.pipe(
    ofType(StructureEditorActionTypes.OpenMessageStructureMetadataEditor),
    concatMap((action: OpenMessageStructureMetadataEditor) => {
      return combineLatest(
        this.structureEditorService.getMessageStructureById(action.payload.id),
        this.store.select(selectMessageStructureById, { id: action.payload.id }),
      ).pipe(
        take(1),
        map(([ms, display]) => {
          return new OpenEditor({
            id: action.payload.id,
            editor: {
              id: EditorID.CUSTOM_MESSAGE_STRUC_METADATA,
              title: 'Metadata',
            },
            display,
            initial: this.structureEditorService.getMessageMetadata(ms),
          });
        }),
      );
    }),
  );

  @Effect()
  openSegmentStructureMetadataEditor$ = this.actions$.pipe(
    ofType(StructureEditorActionTypes.OpenSegmentStructureMetadataEditor),
    concatMap((action: OpenSegmentStructureMetadataEditor) => {
      return combineLatest(
        this.structureEditorService.getSegmentById(action.payload.id),
        this.store.select(selectSegmentStructureById, { id: action.payload.id }),
      ).pipe(
        take(1),
        map(([ms, display]) => {
          return new OpenEditor({
            id: action.payload.id,
            editor: {
              id: EditorID.CUSTOM_SEGMENT_STRUC_METADATA,
              title: 'Metadata',
            },
            display,
            initial: this.structureEditorService.getSegmentMetadata(ms),
          });
        }),
      );
    }),
  );

  @Effect()
  toolbarSave$ = this.actions$.pipe(
    ofType(fromDamActions.DamActionTypes.GlobalSave),
    map((action: fromDamActions.GlobalSave) => {
      return new fromDamActions.EditorSave();
    }),
  );

  constructor(actions$: Actions<StructureEditorActions>, private store: Store<any>, private structureEditorService: StructureEditorService) {
    super(STRUCT_EDIT_WIDGET_ID, actions$);
  }

}
