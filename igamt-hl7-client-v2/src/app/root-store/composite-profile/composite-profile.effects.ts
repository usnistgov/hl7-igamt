import {HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {Store} from '@ngrx/store';

import {EMPTY, of} from 'rxjs';
import {catchError, concatMap, flatMap, map, switchMap, take} from 'rxjs/operators';
import {CompositeProfileService} from '../../modules/composite-profile/services/composite-profile.service';
import {OpenEditorService} from '../../modules/core/services/open-editor.service';
import {MessageService} from '../../modules/dam-framework/services/message.service';
import {SetValue} from '../../modules/dam-framework/store';
import * as fromDAM from '../../modules/dam-framework/store';
import * as fromDamActions from '../../modules/dam-framework/store/data/dam.actions';
import {ICompositeProfile} from '../../modules/shared/models/composite-profile';
import {ConformanceStatementService} from '../../modules/shared/services/conformance-statement.service';
import {IState} from '../conformance-profile-edit/conformance-profile-edit.reducer';
import * as fromIgamtDisplaySelectors from '../dam-igamt/igamt.resource-display.selectors';
import * as fromIgamtSelectedSelectors from '../dam-igamt/igamt.selected-resource.selectors';
import {
  CompositeProfileActions,
  CompositeProfileActionTypes,
  LoadCompositeProfile, LoadCompositeProfileFailure,
  LoadCompositeProfileSuccess, OpenCompositionEditor,
} from './composite-profile.actions';

@Injectable()
export class CompositeProfileEffects {

  @Effect()
  loadCompositeProfile$ = this.actions$.pipe(
    ofType(CompositeProfileActionTypes.LoadCompositeProfile),
    concatMap((action: LoadCompositeProfile) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return this.compositeProfileService.getById(action.id).pipe(
        take(1),
        flatMap((compositeProfile: ICompositeProfile) => {
          return [
            new fromDAM.TurnOffLoader(),
            new LoadCompositeProfileSuccess(compositeProfile),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
          return of(
            new fromDAM.TurnOffLoader(),
            new LoadCompositeProfileFailure(error),
          );
        }),
      );
    }),
  );

  @Effect()
  loadCompositeProfileSuccess$ = this.actions$.pipe(
    ofType(CompositeProfileActionTypes.LoadCompositeProfileSuccess),
    flatMap((action: LoadCompositeProfileSuccess) => {
      return [
        new SetValue({
          selected: action.payload,
        }),
      ];
    }),
  );

  @Effect()
  loadConformanceProfileFailure$ = this.actions$.pipe(
    ofType(CompositeProfileActionTypes.LoadCompositeProfileFailure),
    map((action: LoadCompositeProfileFailure) => {
      return this.message.actionFromError(action.error);
    }),
  );

  @Effect()
  openCompositeProfileComposition$ = this.actions$.pipe(
    ofType(CompositeProfileActionTypes.OpenCompositionEditor),
    switchMap((action: OpenCompositionEditor) => {
      return this.store.select(fromIgamtSelectedSelectors.selectedCompositeProfile)
        .pipe(
          take(1),
          flatMap((compositeProfile) => {
            return this.store.select(fromIgamtDisplaySelectors.selectCompositeProfileById, { id: compositeProfile.id }).pipe(
              take(1),
              map((messageDisplay) => {
                return new fromDamActions.OpenEditor({
                  id: action.payload.id,
                  display: messageDisplay,
                  editor: action.payload.editor,
                  initial: compositeProfile,
                });
              }),
            );
          }),
        );
    }),
  );

  constructor(
    private actions$: Actions<CompositeProfileActions>,
    private store: Store<IState>,
    private message: MessageService,
    private conformanceStatementService: ConformanceStatementService,
    private compositeProfileService: CompositeProfileService,
    private editorHelper: OpenEditorService) { }

}
