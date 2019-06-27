import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, flatMap, map, switchMap } from 'rxjs/operators';
import * as fromIgEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { MessageService } from '../../modules/core/services/message.service';
import { OpenEditorService } from '../../modules/core/services/open-editor.service';
import { DatatypeService } from '../../modules/datatype/services/datatype.service';
import { Type } from '../../modules/shared/constants/type.enum';
import { IDatatype } from '../../modules/shared/models/datatype.interface';
import { LoadSelectedResource } from '../ig/ig-edit/ig-edit.actions';
import { selectedResourceMetadata, selectedResourcePostDef, selectedResourcePreDef } from '../ig/ig-edit/ig-edit.selectors';
import { TurnOffLoader, TurnOnLoader } from '../loader/loader.actions';
import { DatatypeEditActionTypes, LoadDatatype, LoadDatatypeFailure, LoadDatatypeSuccess, OpenDatatypeMetadataEditorNode, OpenDatatypePostDefEditor, OpenDatatypePreDefEditor, OpenDatatypeStructureEditor } from './datatype-edit.actions';

@Injectable()
export class DatatypeEditEffects {

  @Effect()
  loadDatatype$ = this.actions$.pipe(
    ofType(DatatypeEditActionTypes.LoadDatatype),
    switchMap((action: LoadDatatype) => {
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
    map((action: LoadDatatypeSuccess) => {
      return new LoadSelectedResource(action.Datatype);
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
    fromIgEdit.selectDatatypesById,
    this.store.select(selectedResourcePreDef),
    this.DatatypeNotFound,
  );

  @Effect()
  openDatatypePostDefEditor$ = this.editorHelper.openDefEditorHandler<string, OpenDatatypePostDefEditor>(
    DatatypeEditActionTypes.OpenDatatypePostDefEditor,
    fromIgEdit.selectDatatypesById,
    this.store.select(selectedResourcePostDef),
    this.DatatypeNotFound,
  );

  @Effect()
  openDatatypeMetadataEditor$ = this.editorHelper.openMetadataEditor<OpenDatatypeMetadataEditorNode>(
    DatatypeEditActionTypes.OpenDatatypeMetadataEditorNode,
    fromIgEdit.selectDatatypesById,
    this.store.select(selectedResourceMetadata),
    this.DatatypeNotFound,
  );

  @Effect()
  openDatatypeStructureEditor$ = this.editorHelper.openStructureEditor<IDatatype, OpenDatatypeStructureEditor>(
    DatatypeEditActionTypes.OpenDatatypeStructureEditor,
    Type.DATATYPE,
    fromIgEdit.selectDatatypesById,
    this.store.select(fromIgEdit.selectedDatatype),
    this.DatatypeNotFound,
  );

  constructor(
    private actions$: Actions<any>,
    private store: Store<any>,
    private message: MessageService,
    private editorHelper: OpenEditorService,
    private datatypeService: DatatypeService,
  ) { }

}
