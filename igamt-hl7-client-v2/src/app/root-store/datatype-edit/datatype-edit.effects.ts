import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest, of } from 'rxjs';
import {catchError, concatMap, flatMap, map, switchMap, take} from 'rxjs/operators';
import * as fromIgEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { MessageType, UserMessage } from '../../modules/core/models/message/message.class';
import { MessageService } from '../../modules/core/services/message.service';
import { DatatypeService } from '../../modules/datatype/services/datatype.service';
import { Type } from '../../modules/shared/constants/type.enum';
import { IDatatype } from '../../modules/shared/models/datatype.interface';
import {CrossReferencesService} from '../../modules/shared/services/cross-references.service';
import { RxjsStoreHelperService } from '../../modules/shared/services/rxjs-store-helper.service';
import { IgEditActionTypes, LoadResourceReferences, LoadResourceReferencesFailure, LoadResourceReferencesSuccess, LoadSelectedResource, OpenEditor, OpenEditorFailure } from '../ig/ig-edit/ig-edit.actions';
import { selectedResourceMetadata, selectedResourcePostDef, selectedResourcePreDef } from '../ig/ig-edit/ig-edit.selectors';
import { TurnOffLoader, TurnOnLoader } from '../loader/loader.actions';
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
        this.store.select(selectedResourceMetadata))
        .pipe(
          take(1),
          flatMap(([elm, metadata]): Action[] => {
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
                    ...metadata,
                  },
                }),
              ];
            }
          }),
        );
    }),
  );

  @Effect()
  openDatatypeStructureEditor$ = this.actions$.pipe(
    ofType(DatatypeEditActionTypes.OpenDatatypeStructureEditor),
    switchMap((action: OpenDatatypeStructureEditor) => {
      return combineLatest(this.store.select(fromIgEdit.selectDatatypesById, { id: action.payload.id }),
        this.store.select(fromIgEdit.selectedDatatype)).pipe(
          take(1),
          switchMap(([elm, datatype]) => {
            if (!elm || !elm.id) {
              return of(
                this.message.userMessageToAction(new UserMessage<never>(MessageType.FAILED, this.DatatypeNotFound + action.payload.id)),
                new OpenEditorFailure({ id: action.payload.id }));
            } else {
              const openEditor = new OpenEditor({
                id: action.payload.id,
                element: elm,
                editor: action.payload.editor,
                initial: {
                  changes: {},
                  datatype,
                },
              });
              this.store.dispatch(new LoadResourceReferences({ resourceType: Type.DATATYPE, id: action.payload.id }));
              return this.rxjsHelper.listenAndReact(this.actions$, {
                [IgEditActionTypes.LoadResourceReferencesSuccess]: {
                  do: (loadSuccess: LoadResourceReferencesSuccess) => {
                    return of(openEditor);
                  },
                },
                [IgEditActionTypes.LoadResourceReferencesFailure]: {
                  do: (loadFailure: LoadResourceReferencesFailure) => {
                    return of(new OpenEditorFailure({ id: action.payload.id }));
                  },
                },
              });
            }
          }),
        );
    }),
  );

  @Effect()
  openDatatypeCrossRefEditor$ = this.actions$.pipe(
    ofType(DatatypeEditActionTypes.OpenDatatypeCrossRefEditor),
    switchMap((action: OpenDatatypeCrossRefEditor) => {
      return combineLatest(
        this.store.select(fromIgEdit.selectDatatypesById, { id: action.payload.id }),
        this.store.select(fromIgEdit.selectIgId).pipe(
          concatMap((igId: string) =>  this.crossReferenceService.findUsagesDisplay(igId, Type.IGDOCUMENT, Type.DATATYPE, action.payload.id)),
        ))
        .pipe(
          take(1),
          flatMap(([elm, crossRef]): Action[] => {
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
                  initial: crossRef,
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
    private rxjsHelper: RxjsStoreHelperService,
    private datatypeService: DatatypeService,
    private crossReferenceService: CrossReferencesService,
  ) { }

}
