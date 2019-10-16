import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, flatMap, map, mergeMap, switchMap, take } from 'rxjs/operators';
import { IConformanceProfile } from 'src/app/modules/shared/models/conformance-profile.interface';
import * as fromIgEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { ConformanceProfileService } from '../../modules/conformance-profile/services/conformance-profile.service';
import { MessageService } from '../../modules/core/services/message.service';
import { OpenEditorService } from '../../modules/core/services/open-editor.service';
import { Type } from '../../modules/shared/constants/type.enum';
import { ICPConformanceStatementList } from '../../modules/shared/models/cs-list.interface';
import { DeltaService } from '../../modules/shared/services/delta.service';
import { LoadSelectedResource, OpenEditor, OpenEditorBase } from '../ig/ig-edit/ig-edit.actions';
import { selectedConformanceProfile, selectedResourcePostDef, selectedResourcePreDef, selectIgId, selectMessagesById } from '../ig/ig-edit/ig-edit.selectors';
import { TurnOffLoader, TurnOnLoader } from '../loader/loader.actions';
import {
  ConformanceProfileEditActions,
  ConformanceProfileEditActionTypes,
  LoadConformanceProfile,
  LoadConformanceProfileFailure,
  LoadConformanceProfileSuccess,
  OpenConformanceProfilePostDefEditor,
  OpenConformanceProfilePreDefEditor,
} from './conformance-profile-edit.actions';
import { OpenConformanceProfileDeltaEditor, OpenConformanceProfileMetadataEditor, OpenConformanceProfileStructureEditor, OpenCPConformanceStatementEditor } from './conformance-profile-edit.actions';
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

  @Effect()
  openCpMetadataNode$ = this.actions$.pipe(
    ofType(ConformanceProfileEditActionTypes.OpenConformanceProfileMetadataEditor),
    switchMap((action: OpenConformanceProfileMetadataEditor) => {
      return this.store.select(selectedConformanceProfile)
        .pipe(
          take(1),
          flatMap((conformanceProfile) => {
            return this.store.select(selectMessagesById, { id: conformanceProfile.id }).pipe(
              take(1),
              map((messageDisplay) => {
                return new OpenEditor({
                  id: action.payload.id,
                  element: messageDisplay,
                  editor: action.payload.editor,
                  initial: this.conformanceProfileService.conformanceProfileToMetadata(conformanceProfile),
                });
              }),
            );
          }),
        );
    }),
  );

  ConfPNotFound = 'Could not find conformance profile with ID ';

  @Effect()
  openMessageStructureEditor$ = this.editorHelper.openStructureEditor<IConformanceProfile, OpenConformanceProfileStructureEditor>(
    ConformanceProfileEditActionTypes.OpenConformanceProfileStructureEditor,
    Type.CONFORMANCEPROFILE,
    fromIgEdit.selectMessagesById,
    this.store.select(fromIgEdit.selectedConformanceProfile),
    this.ConfPNotFound,
  );

  @Effect()
  openConformanceProfilePreDefEditor$ = this.editorHelper.openDefEditorHandler<string, OpenConformanceProfilePreDefEditor>(
    ConformanceProfileEditActionTypes.OpenConformanceProfilePreDefEditor,
    fromIgEdit.selectMessagesById,
    this.store.select(selectedResourcePreDef),
    this.ConfPNotFound,
  );

  @Effect()
  openConformanceProfilePostDefEditor$ = this.editorHelper.openDefEditorHandler<string, OpenConformanceProfilePostDefEditor>(
    ConformanceProfileEditActionTypes.OpenConformanceProfilePostDefEditor,
    fromIgEdit.selectMessagesById,
    this.store.select(selectedResourcePostDef),
    this.ConfPNotFound,
  );

  @Effect()
  openConformanceStatementEditor$ = this.editorHelper.openConformanceStatementEditor<ICPConformanceStatementList, OpenCPConformanceStatementEditor>(
    ConformanceProfileEditActionTypes.OpenCPConformanceStatementEditor,
    Type.CONFORMANCEPROFILE,
    fromIgEdit.selectMessagesById,
    (action: OpenEditorBase) => {
      return this.store.select(selectIgId).pipe(
        take(1),
        mergeMap((igId) => {
          return this.conformanceProfileService.getConformanceStatements(action.payload.id, igId);
        }),
      );
    },
    this.ConfPNotFound,
  );

  @Effect()
  openDeltaEditor$ = this.editorHelper.openDeltaEditor<OpenConformanceProfileDeltaEditor>(
    ConformanceProfileEditActionTypes.OpenConformanceProfileDeltaEditor,
    Type.CONFORMANCEPROFILE,
    fromIgEdit.selectMessagesById,
    this.deltaService.getDeltaFromOrigin,
    this.ConfPNotFound,
  );

  constructor(
    private actions$: Actions<ConformanceProfileEditActions>,
    private store: Store<IState>,
    private message: MessageService,
    private deltaService: DeltaService,
    private conformanceProfileService: ConformanceProfileService,
    private editorHelper: OpenEditorService) { }

}
