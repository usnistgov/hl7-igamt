import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest, of } from 'rxjs';
import { catchError, flatMap, map, switchMap, take } from 'rxjs/operators';
import * as fromIgEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { MessageType, UserMessage } from '../../modules/core/models/message/message.class';
import { MessageService } from '../../modules/core/services/message.service';
import { DatatypeService } from '../../modules/datatype/services/datatype.service';
import { IDatatype } from '../../modules/shared/models/datatype.interface';
import { LoadSelectedResource, OpenEditor, OpenEditorFailure } from '../ig/ig-edit/ig-edit.actions';
import { selectedDatatype, selectedResourcePostDef, selectedResourcePreDef } from '../ig/ig-edit/ig-edit.selectors';
import { TurnOffLoader, TurnOnLoader } from '../loader/loader.actions';
import { DatatypeEditActionTypes, LoadDatatype, LoadDatatypeFailure, LoadDatatypeSuccess, OpenDatatypeMetadataEditorNode, OpenDatatypePostDefEditor, OpenDatatypePreDefEditor } from './datatype-edit.actions';

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
  openDatatypePreDefEditor$ = this.actions$.pipe(
    ofType(DatatypeEditActionTypes.OpenDatatypePreDefEditor),
    switchMap((action: OpenDatatypePreDefEditor) => {
      return combineLatest(
        this.store.select(fromIgEdit.selectDatatypesById, { id: action.payload.id }),
        this.store.select(selectedResourcePreDef))
        .pipe(
          take(1),
          flatMap(([elm, predef]): Action[] => {
            if (!elm || !elm.id) {
              return [
                this.message.userMessageToAction(new UserMessage<never>(MessageType.FAILED, this.DatatypeNotFound + action.payload.id)),
                new OpenEditorFailure({ id: action.payload.id }),
              ];
            } else {
              return [
                new OpenEditor({
                  id: action.payload.id,
                  element: elm,
                  editor: action.payload.editor,
                  initial: {
                    value: predef,
                  },
                }),
              ];
            }
          }),
        );
    }),
  );

  @Effect()
  openDatatypePostDefEditor$ = this.actions$.pipe(
    ofType(DatatypeEditActionTypes.OpenDatatypePostDefEditor),
    switchMap((action: OpenDatatypePostDefEditor) => {
      return combineLatest(
        this.store.select(fromIgEdit.selectDatatypesById, { id: action.payload.id }),
        this.store.select(selectedResourcePostDef))
        .pipe(
          take(1),
          flatMap(([elm, postdef]): Action[] => {
            if (!elm || !elm.id) {
              return [
                this.message.userMessageToAction(new UserMessage<never>(MessageType.FAILED, this.DatatypeNotFound + action.payload.id)),
                new OpenEditorFailure({ id: action.payload.id }),
              ];
            } else {
              return [
                new OpenEditor({
                  id: action.payload.id,
                  element: elm,
                  editor: action.payload.editor,
                  initial: {
                    value: postdef,
                  },
                }),
              ];
            }
          }),
        );
    }),
  );

  @Effect()
  openDatatypeMetadataEditor$ = this.actions$.pipe(
    ofType(DatatypeEditActionTypes.OpenDatatypeMetadataEditorNode),
    switchMap((action: OpenDatatypeMetadataEditorNode) => {
      return combineLatest(
        this.store.select(fromIgEdit.selectDatatypesById, { id: action.payload.id }),
        this.store.select(selectedDatatype))
        .pipe(
          take(1),
          flatMap(([elm, datatype]): Action[] => {
            if (!elm || !elm.id) {
              return [
                this.message.userMessageToAction(new UserMessage<never>(MessageType.FAILED, this.DatatypeNotFound + action.payload.id)),
                new OpenEditorFailure({ id: action.payload.id }),
              ];
            } else {
              return [
                new OpenEditor({
                  id: action.payload.id,
                  element: elm,
                  editor: action.payload.editor,
                  initial: {
                    name: datatype.name,
                    ext: datatype.ext,
                  },
                }),
              ];
            }
          }),
        );
    }),
  );

  constructor(
    private actions$: Actions<any>,
    private store: Store<any>,
    private message: MessageService,
    private datatypeService: DatatypeService,
  ) { }

}
