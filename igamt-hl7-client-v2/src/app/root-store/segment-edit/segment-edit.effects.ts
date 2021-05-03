import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, of } from 'rxjs';
import { catchError, concatMap, flatMap, map, mergeMap, take } from 'rxjs/operators';
import { OpenEditorBase } from 'src/app/modules/dam-framework/store/index';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import * as fromIgamtSelectedSelectors from 'src/app/root-store/dam-igamt/igamt.selected-resource.selectors';
import * as fromIgamtSelectors from 'src/app/root-store/dam-igamt/igamt.selectors';
import { IConformanceStatementEditorData } from '../../modules/core/components/conformance-statement-editor/conformance-statement-editor.component';
import { OpenEditorService } from '../../modules/core/services/open-editor.service';
import { MessageService } from '../../modules/dam-framework/services/message.service';
import { SetValue } from '../../modules/dam-framework/store/data/dam.actions';
import { SegmentService } from '../../modules/segment/services/segment.service';
import { IUsages } from '../../modules/shared/models/cross-reference';
import { ISegment } from '../../modules/shared/models/segment.interface';
import { ConformanceStatementService } from '../../modules/shared/services/conformance-statement.service';
import { CrossReferencesService } from '../../modules/shared/services/cross-references.service';
import { DeltaService } from '../../modules/shared/services/delta.service';
import { selectDatatypesById } from '../dam-igamt/igamt.resource-display.selectors';
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
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return this.segmentService.getById(action.id).pipe(
        flatMap((segment: ISegment) => {
          return [
            new fromDAM.TurnOffLoader(),
            new SetValue({
              selected: segment,
            }),
            new LoadSegmentSuccess(segment),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
          return of(
            new fromDAM.TurnOffLoader(),
            new LoadSegmentFailure(error),
          );
        }),
      );
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
    fromIgamtDisplaySelectors.selectSegmentsById,
    this.store.select(fromIgamtSelectedSelectors.selectedResourcePreDef),
    this.SegmentNotFound,
  );

  @Effect()
  openSegmentMetadataEditor$ = this.editorHelper.openMetadataEditor<OpenSegmentMetadataEditor>(
    SegmentEditActionTypes.OpenSegmentMetadataEditor,
    fromIgamtDisplaySelectors.selectSegmentsById,
    this.store.select(fromIgamtSelectedSelectors.selectedResourceMetadata),
    this.SegmentNotFound,
  );

  @Effect()
  openSegmentPostDefEditor$ = this.editorHelper.openDefEditorHandler<string, OpenSegmentPostDefEditor>(
    SegmentEditActionTypes.OpenSegmentPostDefEditor,
    fromIgamtDisplaySelectors.selectSegmentsById,
    this.store.select(fromIgamtSelectedSelectors.selectedResourcePostDef),
    this.SegmentNotFound,
  );

  @Effect()
  openSegmentCrossRefEditor$ = this.editorHelper.openCrossRefEditor<IUsages[], OpenSegmentCrossRefEditor>(
    SegmentEditActionTypes.OpenSegmentCrossRefEditor,
    fromIgamtDisplaySelectors.selectSegmentsById,
    Type.IGDOCUMENT,
    Type.SEGMENT,
    fromIgamtSelectors.selectLoadedDocumentInfo,
    this.crossReferenceService.findUsagesDisplay,
    this.SegmentNotFound,
  );

  @Effect()
  openSegmentStructureEditor$ = this.editorHelper.openStructureEditor<ISegment, OpenSegmentStructureEditor>(
    SegmentEditActionTypes.OpenSegmentStructureEditor,
    Type.SEGMENT,
    fromIgamtDisplaySelectors.selectSegmentsById,
    this.store.select(fromIgamtSelectedSelectors.selectedSegment),
    this.SegmentNotFound,
  );

  @Effect()
  openConformanceStatementEditor$ = this.editorHelper.openConformanceStatementEditor<IConformanceStatementEditorData, OpenSegmentConformanceStatementEditor>(
    SegmentEditActionTypes.OpenSegmentConformanceStatementEditor,
    Type.SEGMENT,
    fromIgamtDisplaySelectors.selectSegmentsById,
    (action: OpenEditorBase) => {
      return this.store.select(fromIgamtSelectors.selectLoadedDocumentInfo).pipe(
        take(1),
        mergeMap((documentInfo) => {
          return this.segmentService.getConformanceStatements(action.payload.id, documentInfo);
        }),
        flatMap((data) => {
          const datatypes = this.conformanceStatementService.resolveDependantConformanceStatement(data.associatedConformanceStatementMap || {}, selectDatatypesById);

          return (datatypes.length > 0 ? combineLatest(datatypes) : of([])).pipe(
            take(1),
            map((d) => {
              return {
                active: this.conformanceStatementService.createEditableNode(data.conformanceStatements || []),
                dependants: {
                  datatypes: d,
                },
              };
            }),
          );
        }),
      );
    },
    this.SegmentNotFound,
  );

  @Effect()
  OpenSegmentDynamicMappingEditor$ = this.editorHelper.openDynMappingEditor<OpenSegmentDynamicMappingEditor>(
    SegmentEditActionTypes.OpenSegmentDynamicMappingEditor,
    fromIgamtDisplaySelectors.selectSegmentsById,
    (action: OpenSegmentDynamicMappingEditor) => {
      return this.store.select(fromIgamtSelectedSelectors.selectedSegment).pipe(
        take(1),
      );
    },
    this.SegmentNotFound,
  );

  @Effect()
  openDeltaEditor$ = this.editorHelper.openDeltaEditor<OpenSegmentDeltaEditor>(
    SegmentEditActionTypes.OpenSegmentDeltaEditor,
    Type.SEGMENT,
    fromIgamtDisplaySelectors.selectSegmentsById,
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
    private conformanceStatementService: ConformanceStatementService,
    private crossReferenceService: CrossReferencesService,
  ) { }

}
