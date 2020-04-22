import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, flatMap, map, mergeMap, take } from 'rxjs/operators';
import { CrossReferencesService } from 'src/app/modules/shared/services/cross-references.service';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import * as fromIgamtSelectedSelectors from 'src/app/root-store/dam-igamt/igamt.selected-resource.selectors';
import * as fromIgamtSelectors from 'src/app/root-store/dam-igamt/igamt.selectors';
import { MessageService } from '../../modules/core/services/message.service';
import { OpenEditorService } from '../../modules/core/services/open-editor.service';
import { OpenEditorBase, SetValue } from '../../modules/dam-framework/store/dam.actions';
import { DatatypeService } from '../../modules/datatype/services/datatype.service';
import { Type } from '../../modules/shared/constants/type.enum';
import { IUsages } from '../../modules/shared/models/cross-reference';
import { IConformanceStatementList } from '../../modules/shared/models/cs-list.interface';
import { IDatatype } from '../../modules/shared/models/datatype.interface';
import { DeltaService } from '../../modules/shared/services/delta.service';
import { TurnOffLoader, TurnOnLoader } from '../loader/loader.actions';
import { OpenDatatypeConformanceStatementEditor, OpenDatatypeDeltaEditor } from './datatype-edit.actions';
import {
  DatatypeEditActionTypes,
  LoadDatatype,
  LoadDatatypeFailure,
  LoadDatatypeSuccess,
  OpenDatatypeCrossRefEditor,
  OpenDatatypeMetadataEditorNode,
  OpenDatatypePostDefEditor,
  OpenDatatypePreDefEditor,
  OpenDatatypeStructureEditor,
} from './datatype-edit.actions';

@Injectable()
export class DatatypeEditEffects {

  @Effect()
  loadDatatype$ = this.actions$.pipe(
    ofType(DatatypeEditActionTypes.LoadDatatype),
    concatMap((action: LoadDatatype) => {
      this.store.dispatch(new TurnOnLoader({
        blockUI: true,
      }));
      return this.datatypeService.getById(action.id).pipe(
        flatMap((Datatype: IDatatype) => {
          return [
            new TurnOffLoader(),
            new LoadDatatypeSuccess(Datatype),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
          return of(
            new TurnOffLoader(),
            new LoadDatatypeFailure(error),
          );
        }),
      );
    }),
  );

  @Effect()
  LoadDatatypeSuccess$ = this.actions$.pipe(
    ofType(DatatypeEditActionTypes.LoadDatatypeSuccess),
    flatMap((action: LoadDatatypeSuccess) => {
      return [
        new SetValue({
          selected: action.Datatype,
        }),
      ];
    }),
  );

  @Effect()
  LoadDatatypeFailure$ = this.actions$.pipe(
    ofType(DatatypeEditActionTypes.LoadDatatypeFailure),
    map((action: LoadDatatypeFailure) => {
      return this.message.actionFromError(action.error);
    }),
  );

  DatatypeNotFound = 'Could not find Datatype with ID ';

  @Effect()
  openDatatypePreDefEditor$ = this.editorHelper.openDefEditorHandler<string, OpenDatatypePreDefEditor>(
    DatatypeEditActionTypes.OpenDatatypePreDefEditor,
    fromIgamtDisplaySelectors.selectDatatypesById,
    this.store.select(fromIgamtSelectedSelectors.selectedResourcePreDef),
    this.DatatypeNotFound,
  );

  @Effect()
  openDatatypePostDefEditor$ = this.editorHelper.openDefEditorHandler<string, OpenDatatypePostDefEditor>(
    DatatypeEditActionTypes.OpenDatatypePostDefEditor,
    fromIgamtDisplaySelectors.selectDatatypesById,
    this.store.select(fromIgamtSelectedSelectors.selectedResourcePostDef),
    this.DatatypeNotFound,
  );

  @Effect()
  openDatatypeMetadataEditor$ = this.editorHelper.openMetadataEditor<OpenDatatypeMetadataEditorNode>(
    DatatypeEditActionTypes.OpenDatatypeMetadataEditorNode,
    fromIgamtDisplaySelectors.selectDatatypesById,
    this.store.select(fromIgamtSelectedSelectors.selectedResourceMetadata),
    this.DatatypeNotFound,
  );

  @Effect()
  openDatatypeStructureEditor$ = this.editorHelper.openStructureEditor<IDatatype, OpenDatatypeStructureEditor>(
    DatatypeEditActionTypes.OpenDatatypeStructureEditor,
    Type.DATATYPE,
    fromIgamtDisplaySelectors.selectDatatypesById,
    this.store.select(fromIgamtSelectedSelectors.selectedDatatype),
    this.DatatypeNotFound,
  );

  @Effect()
  openDatatypeCrossRefEditor$ = this.editorHelper.openCrossRefEditor<IUsages[], OpenDatatypeCrossRefEditor>(
    DatatypeEditActionTypes.OpenDatatypeCrossRefEditor,
    fromIgamtDisplaySelectors.selectDatatypesById,
    Type.IGDOCUMENT,
    Type.DATATYPE,
    fromIgamtSelectors.selectLoadedDocumentInfo,
    this.crossReferenceService.findUsagesDisplay,
    this.DatatypeNotFound,
  );

  @Effect()
  openConformanceStatementEditor$ = this.editorHelper.openConformanceStatementEditor<IConformanceStatementList, OpenDatatypeConformanceStatementEditor>(
    DatatypeEditActionTypes.OpenDatatypeConformanceStatementEditor,
    Type.DATATYPE,
    fromIgamtDisplaySelectors.selectDatatypesById,
    (action: OpenEditorBase) => {
      return this.store.select(fromIgamtSelectors.selectLoadedDocumentInfo).pipe(
        take(1),
        mergeMap((documentInfo) => {
          return this.datatypeService.getConformanceStatements(action.payload.id, documentInfo);
        }),
      );
    },
    this.DatatypeNotFound,
  );

  @Effect()
  openDeltaEditor$ = this.editorHelper.openDeltaEditor<OpenDatatypeDeltaEditor>(
    DatatypeEditActionTypes.OpenDatatypeDeltaEditor,
    Type.DATATYPE,
    fromIgamtDisplaySelectors.selectDatatypesById,
    this.deltaService.getDeltaFromOrigin,
    this.DatatypeNotFound,
  );

  constructor(
    private actions$: Actions<any>,
    private store: Store<any>,
    private message: MessageService,
    private editorHelper: OpenEditorService,
    private datatypeService: DatatypeService,
    private deltaService: DeltaService,
    private crossReferenceService: CrossReferencesService,
  ) { }

}
