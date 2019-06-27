import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, flatMap, map, switchMap } from 'rxjs/operators';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import * as fromIgEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { MessageService } from '../../modules/core/services/message.service';
import { OpenEditorService } from '../../modules/core/services/open-editor.service';
import { SegmentService } from '../../modules/segment/services/segment.service';
import { ISegment } from '../../modules/shared/models/segment.interface';
import { RxjsStoreHelperService } from '../../modules/shared/services/rxjs-store-helper.service';
import { LoadSelectedResource } from '../ig/ig-edit/ig-edit.actions';
import { selectedResourceMetadata, selectedResourcePostDef, selectedResourcePreDef } from '../ig/ig-edit/ig-edit.selectors';
import { TurnOffLoader, TurnOnLoader } from '../loader/loader.actions';
import { LoadSegment, LoadSegmentFailure, LoadSegmentSuccess, OpenSegmentMetadataEditor, OpenSegmentPostDefEditor, OpenSegmentPreDefEditor, OpenSegmentStructureEditor, SegmentEditActionTypes } from './segment-edit.actions';

@Injectable()
export class SegmentEditEffects {

  @Effect()
  loadSegment$ = this.actions$.pipe(
    ofType(SegmentEditActionTypes.LoadSegment),
    switchMap((action: LoadSegment) => {
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

  constructor(
    private actions$: Actions<any>,
    private store: Store<any>,
    private message: MessageService,
    private segmentService: SegmentService,
    private editorHelper: OpenEditorService,
  ) { }

}
