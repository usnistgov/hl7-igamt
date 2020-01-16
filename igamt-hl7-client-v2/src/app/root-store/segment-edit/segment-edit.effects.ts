import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, flatMap, map, mergeMap, take } from 'rxjs/operators';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import * as fromIgEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { selectedSegment } from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { MessageService } from '../../modules/core/services/message.service';
import { OpenEditorService } from '../../modules/core/services/open-editor.service';
import { SegmentService } from '../../modules/segment/services/segment.service';
import { IUsages } from '../../modules/shared/models/cross-reference';
import { IConformanceStatementList } from '../../modules/shared/models/cs-list.interface';
import { ISegment } from '../../modules/shared/models/segment.interface';
import { CrossReferencesService } from '../../modules/shared/services/cross-references.service';
import { DeltaService } from '../../modules/shared/services/delta.service';
import { LoadSelectedResource, OpenEditorBase } from '../ig/ig-edit/ig-edit.actions';
import { selectedResourceMetadata, selectedResourcePostDef, selectedResourcePreDef, selectIgId } from '../ig/ig-edit/ig-edit.selectors';
import { TurnOffLoader, TurnOnLoader } from '../loader/loader.actions';
import {
  LoadSegment,
  LoadSegmentFailure,
  LoadSegmentSuccess,
  OpenSegmentConformanceStatementEditor,
  OpenSegmentCrossRefEditor,
  OpenSegmentDeltaEditor,
  OpenSegmentDynamicMappingEditor,
  OpenSegmentMetadataEditor,
  OpenSegmentPostDefEditor,
  OpenSegmentPreDefEditor,
  OpenSegmentStructureEditor,
  SegmentEditActionTypes,
} from './segment-edit.actions';

@Injectable()
export class SegmentEditEffects {

  @Effect()
  loadSegment$ = this.actions$.pipe(
    ofType(SegmentEditActionTypes.LoadSegment),
    concatMap((action: LoadSegment) => {
      this.store.dispatch(new TurnOnLoader({
        blockUI: true,
      }));
      return this.segmentService.getById(action.id).pipe(
        flatMap((segment: ISegment) => {
          return [
            new TurnOffLoader(),
            new LoadSegmentSuccess(segment),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
          return of(
            new TurnOffLoader(),
            new LoadSegmentFailure(error),
          );
        }),
      );
    }),
  );

  @Effect()
  LoadSegmentSuccess$ = this.actions$.pipe(
    ofType(SegmentEditActionTypes.LoadSegmentSuccess),
    map((action: LoadSegmentSuccess) => {
      return new LoadSelectedResource(action.segment);
    }),
  );

  @Effect()
  LoadSegmentFailure$ = this.actions$.pipe(
    ofType(SegmentEditActionTypes.LoadSegmentFailure),
    map((action: LoadSegmentFailure) => {
      return this.message.actionFromError(action.error);
    }),
  );

  SegmentNotFound = 'Could not find segment with ID ';

  @Effect()
  openSegmentPreDefEditor$ = this.editorHelper.openDefEditorHandler<string, OpenSegmentPreDefEditor>(
    SegmentEditActionTypes.OpenSegmentPreDefEditor,
    fromIgEdit.selectSegmentsById,
    this.store.select(selectedResourcePreDef),
    this.SegmentNotFound,
  );

  @Effect()
  openSegmentCrossRefEditor$ = this.editorHelper.openCrossRefEditor<IUsages[], OpenSegmentCrossRefEditor>(
    SegmentEditActionTypes.OpenSegmentCrossRefEditor,
    fromIgEdit.selectSegmentsById,
    Type.IGDOCUMENT,
    Type.SEGMENT,
    fromIgEdit.selectIgId,
    this.crossReferenceService.findUsagesDisplay,
    this.SegmentNotFound,
  );

  @Effect()
  openSegmentMetadataEditor$ = this.editorHelper.openMetadataEditor<OpenSegmentMetadataEditor>(
    SegmentEditActionTypes.OpenSegmentMetadataEditor,
    fromIgEdit.selectSegmentsById,
    this.store.select(selectedResourceMetadata),
    this.SegmentNotFound,
  );

  @Effect()
  openSegmentPostDefEditor$ = this.editorHelper.openDefEditorHandler<string, OpenSegmentPostDefEditor>(
    SegmentEditActionTypes.OpenSegmentPostDefEditor,
    fromIgEdit.selectSegmentsById,
    this.store.select(selectedResourcePostDef),
    this.SegmentNotFound,
  );

  @Effect()
  openSegmentStructureEditor$ = this.editorHelper.openStructureEditor<ISegment, OpenSegmentStructureEditor>(
    SegmentEditActionTypes.OpenSegmentStructureEditor,
    Type.SEGMENT,
    fromIgEdit.selectSegmentsById,
    this.store.select(fromIgEdit.selectedSegment),
    this.SegmentNotFound,
  );

  @Effect()
  openConformanceStatementEditor$ = this.editorHelper.openConformanceStatementEditor<IConformanceStatementList, OpenSegmentConformanceStatementEditor>(
    SegmentEditActionTypes.OpenSegmentConformanceStatementEditor,
    Type.SEGMENT,
    fromIgEdit.selectSegmentsById,
    (action: OpenEditorBase) => {
      return this.store.select(selectIgId).pipe(
        take(1),
        mergeMap((igId) => {
          return this.segmentService.getConformanceStatements(action.payload.id, igId);
        }),
      );
    },
    this.SegmentNotFound,
  );

  @Effect()
  OpenSegmentDynamicMappingEditor$ = this.editorHelper.openDynMappingEditor<OpenSegmentDynamicMappingEditor>(
    SegmentEditActionTypes.OpenSegmentDynamicMappingEditor,
    fromIgEdit.selectSegmentsById,
    (action: OpenSegmentDynamicMappingEditor) => {
      return this.store.select(selectedSegment).pipe(
        take(1),
      );
    },
    this.SegmentNotFound,
  );

  @Effect()
  openDeltaEditor$ = this.editorHelper.openDeltaEditor<OpenSegmentDeltaEditor>(
    SegmentEditActionTypes.OpenSegmentDeltaEditor,
    Type.SEGMENT,
    fromIgEdit.selectSegmentsById,
    this.deltaService.getDeltaFromOrigin,
    this.SegmentNotFound,
  );

  constructor(
    private actions$: Actions<any>,
    private store: Store<any>,
    private message: MessageService,
    private deltaService: DeltaService,
    private segmentService: SegmentService,
    private editorHelper: OpenEditorService,
    private crossReferenceService: CrossReferencesService,
  ) { }

}
