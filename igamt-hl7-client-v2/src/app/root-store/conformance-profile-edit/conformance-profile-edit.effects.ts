import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, flatMap, map, switchMap } from 'rxjs/operators';
import { IConformanceProfile } from 'src/app/modules/shared/models/conformance-profile.interface';
import * as fromIgEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { ConformanceProfileService } from '../../modules/conformance-profile/services/conformance-profile.service';
import { MessageService } from '../../modules/core/services/message.service';
import { OpenEditorService } from '../../modules/core/services/open-editor.service';
import { Type } from '../../modules/shared/constants/type.enum';
import { LoadSelectedResource } from '../ig/ig-edit/ig-edit.actions';
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
} from './conformance-profile-edit.actions';
import { OpenConformanceProfileStructureEditor } from './conformance-profile-edit.actions';
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

  constructor(
    private actions$: Actions<ConformanceProfileEditActions>,
    private store: Store<IState>,
    private message: MessageService,
    private conformanceProfileService: ConformanceProfileService,
    private editorHelper: OpenEditorService,
  ) { }

}
