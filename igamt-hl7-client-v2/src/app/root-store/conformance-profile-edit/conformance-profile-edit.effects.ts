import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest, of } from 'rxjs';
import { catchError, flatMap, map, switchMap, take } from 'rxjs/operators';
import { IConformanceProfile } from 'src/app/modules/shared/models/conformance-profile.interface';
import * as fromIgEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { ConformanceProfileService } from '../../modules/conformance-profile/services/conformance-profile.service';
import { MessageType, UserMessage } from '../../modules/core/models/message/message.class';
import { MessageService } from '../../modules/core/services/message.service';
import { Type } from '../../modules/shared/constants/type.enum';
import { RxjsStoreHelperService } from '../../modules/shared/services/rxjs-store-helper.service';
import { IgEditActionTypes, LoadResourceReferences, LoadResourceReferencesFailure, LoadResourceReferencesSuccess, LoadSelectedResource, OpenEditor, OpenEditorFailure } from '../ig/ig-edit/ig-edit.actions';
import { selectedResourcePostDef, selectedResourcePreDef } from '../ig/ig-edit/ig-edit.selectors';
import { TurnOffLoader, TurnOnLoader } from '../loader/loader.actions';
import {
  ConformanceProfileEditActions,
  ConformanceProfileEditActionTypes,
  LoadConformanceProfile,
  LoadConformanceProfileFailure,
  LoadConformanceProfileSuccess,
  OpenConformanceProfilePostDefEditor,
  OpenConformanceProfilePreDefEditor,
  OpenConformanceProfileStructureEditor } from './conformance-profile-edit.actions';
import { IState } from './conformance-profile-edit.reducer';

@Injectable()
export class ConformanceProfileEditEffects {

  @Effect()
  loadConformanceProfile$ = this.actions$.pipe(
    ofType(ConformanceProfileEditActionTypes.LoadConformanceProfile),
    switchMap((action: LoadConformanceProfile) => {
      this.store.dispatch(new TurnOnLoader({
        blockUI: true,
      }));
      return this.conformanceProfileService.getById(action.id).pipe(
        flatMap((conformanceProfile: IConformanceProfile) => {
          return [
            new TurnOffLoader(),
            new LoadConformanceProfileSuccess(conformanceProfile),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
          return of(
            new TurnOffLoader(),
            new LoadConformanceProfileFailure(error),
          );
        }),
      );
    }),
  );

  @Effect()
  loadConformanceProfileSuccess$ = this.actions$.pipe(
    ofType(ConformanceProfileEditActionTypes.LoadConformanceProfileSuccess),
    map((action: LoadConformanceProfileSuccess) => {
      return new LoadSelectedResource(action.payload);
    }),
  );

  @Effect()
  loadConformanceProfileFailure$ = this.actions$.pipe(
    ofType(ConformanceProfileEditActionTypes.LoadConformanceProfileFailure),
    map((action: LoadConformanceProfileFailure) => {
      return this.message.actionFromError(action.error);
    }),
  );

  ConfPNotFound = 'Could not find conformance profile with ID ';

  @Effect()
  openConformanceProfilePreDefEditor$ = this.actions$.pipe(
    ofType(ConformanceProfileEditActionTypes.OpenConformanceProfilePreDefEditor),
    switchMap((action: OpenConformanceProfilePreDefEditor) => {
      return combineLatest(
        this.store.select(fromIgEdit.selectMessagesById, { id: action.payload.id }),
        this.store.select(selectedResourcePreDef))
        .pipe(
          take(1),
          flatMap(([elm, predef]): Action[] => {
            if (!elm || !elm.id) {
              return [
                this.message.userMessageToAction(new UserMessage<never>(MessageType.FAILED, this.ConfPNotFound + action.payload.id)),
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
  openMessageStructureEditor$ = this.actions$.pipe(
    ofType(ConformanceProfileEditActionTypes.OpenConformanceProfileStructureEditor),
    switchMap((action: OpenConformanceProfileStructureEditor) => {
      return combineLatest(this.store.select(fromIgEdit.selectMessagesById, { id: action.payload.id }),
        this.store.select(fromIgEdit.selectedConformanceProfile)).pipe(
          take(1),
          switchMap(([elm, conformanceProfile]) => {
            if (!elm || !elm.id) {
              return of(
                this.message.userMessageToAction(new UserMessage<never>(MessageType.FAILED, this.ConfPNotFound + action.payload.id)),
                new OpenEditorFailure({ id: action.payload.id }));
            } else {
              const openEditor = new OpenEditor({
                id: action.payload.id,
                element: elm,
                editor: action.payload.editor,
                initial: {
                  changes: {},
                  conformanceProfile,
                },
              });
              this.store.dispatch(new LoadResourceReferences({ resourceType: Type.CONFORMANCEPROFILE, id: action.payload.id }));
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
  openConformanceProfilePostDefEditor$ = this.actions$.pipe(
    ofType(ConformanceProfileEditActionTypes.OpenConformanceProfilePostDefEditor),
    switchMap((action: OpenConformanceProfilePostDefEditor) => {
      return combineLatest(
        this.store.select(fromIgEdit.selectMessagesById, { id: action.payload.id }),
        this.store.select(selectedResourcePostDef))
        .pipe(
          take(1),
          flatMap(([elm, postdef]): Action[] => {
            if (!elm || !elm.id) {
              return [
                this.message.userMessageToAction(new UserMessage<never>(MessageType.FAILED, this.ConfPNotFound + action.payload.id)),
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

  constructor(
    private actions$: Actions<ConformanceProfileEditActions>,
    private store: Store<IState>,
    private message: MessageService,
    private rxjsHelper: RxjsStoreHelperService,
    private conformanceProfileService: ConformanceProfileService,
  ) { }

}
