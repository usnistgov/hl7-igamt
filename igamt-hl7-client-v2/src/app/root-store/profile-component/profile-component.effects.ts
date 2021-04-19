import {HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {catchError, concatMap, flatMap, map, pluck, switchMap, take} from 'rxjs/operators';
import {OpenEditorService} from '../../modules/core/services/open-editor.service';
import {MessageService} from '../../modules/dam-framework/services/message.service';
import {SetValue} from '../../modules/dam-framework/store';
import * as fromDAM from '../../modules/dam-framework/store';
import * as fromDamActions from '../../modules/dam-framework/store/data/dam.actions';
import * as fromRouterSelector from '../../modules/dam-framework/store/router/router.selectors';
import {ProfileComponentService} from '../../modules/profile-component/services/profile-component.service';
import {IProfileComponent, IProfileComponentContext} from '../../modules/shared/models/profile.component';
import {ConformanceStatementService} from '../../modules/shared/services/conformance-statement.service';
import {CrossReferencesService} from '../../modules/shared/services/cross-references.service';
import {DeltaService} from '../../modules/shared/services/delta.service';
import * as fromIgamtDisplaySelectors from '../dam-igamt/igamt.resource-display.selectors';
import * as fromIgamtSelectedSelectors from '../dam-igamt/igamt.selected-resource.selectors';
import {
  LoadContext,
  LoadContextFailure,
  LoadContextSuccess,
  LoadProfileComponent,
  LoadProfileComponentFailure,
  LoadProfileComponentSuccess, OpenContextStructureEditor, OpenProfileComponentMetadataEditor,
  ProfileComponentActions,
  ProfileComponentActionTypes,
} from './profile-component.actions';

@Injectable()
export class ProfileComponentEffects {

  @Effect()
  loadProfileComponent$ = this.actions$.pipe(
    ofType(ProfileComponentActionTypes.LoadProfileComponent),
    concatMap((action: LoadProfileComponent) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return this.profileComponentService.getById(action.id).pipe(
        flatMap((profileComponent: IProfileComponent) => {
          return [
            new fromDAM.TurnOffLoader(),
            new LoadProfileComponentSuccess(profileComponent),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
          return of(
            new fromDAM.TurnOffLoader(),
            new LoadProfileComponentFailure(error),
          );
        }),
      );
    }),
  );
  @Effect()
  loadContext$ = this.actions$.pipe(
    ofType(ProfileComponentActionTypes.LoadContext),
    concatMap((action: LoadContext) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return this.store.select(fromRouterSelector.selectRouteParams).pipe(
        take(1),
        pluck('pcId'),
        switchMap((pcId) => {
          return this.profileComponentService.getChildById((pcId as string), action.id).pipe(
            flatMap((context: IProfileComponentContext) => {
              return [
                new fromDAM.TurnOffLoader(),
                new LoadContextSuccess(context),
              ];
            }),
            catchError((error: HttpErrorResponse) => {
              return of(
                new fromDAM.TurnOffLoader(),
                new LoadContextFailure(error),
              );
            }),
          );
        }),
      );
    }),
  );

  @Effect()
  LoadContextSuccess$ = this.actions$.pipe(
    ofType(ProfileComponentActionTypes.LoadContextSuccess),
    flatMap((action: LoadContextSuccess) => {
      return [
        new SetValue({
          context: action.context,
        }),
      ];
    }),
  );
  @Effect()
  LoadProfileComponentSuccess$ = this.actions$.pipe(
    ofType(ProfileComponentActionTypes.LoadProfileComponentSuccess),
    flatMap((action: LoadProfileComponentSuccess) => {
      return [
        new SetValue({
          profileComponent: action.profileComponent,
          selected: action.profileComponent,
        }),
      ];
    }),
  );

  @Effect()
  LoadContextFailure$ = this.actions$.pipe(
    ofType(ProfileComponentActionTypes.LoadContextFailure),
    map((action: LoadContextFailure) => {
      return this.message.actionFromError(action.error);
    }),
  );

  @Effect()
  LoadProfileComponentFailure$ = this.actions$.pipe(
    ofType(ProfileComponentActionTypes.LoadProfileComponentFailure),
    map((action: LoadProfileComponentFailure) => {
      return this.message.actionFromError(action.error);
    }),
  );

  @Effect()
  openCpMetadataNode$ = this.actions$.pipe(
    ofType(ProfileComponentActionTypes.OpenProfileComponentMetadataEditor),
    switchMap((action: OpenProfileComponentMetadataEditor) => {
      return this.store.select(fromIgamtSelectedSelectors.selectedProfileComponent)
        .pipe(
          take(1),
          flatMap((pc) => {
            return this.store.select(fromIgamtDisplaySelectors.selectProfileComponentById, { id: pc.id }).pipe(
              take(1),
              map((messageDisplay) => {
                return new fromDamActions.OpenEditor({
                  id: action.payload.id,
                  display: messageDisplay,
                  editor: action.payload.editor,
                  initial: this.profileComponentService.profileComponentToMetadata(pc),
                });
              }),
            );
          }),
        );
    }),
  );

  @Effect()
  openStructureEditor$ = this.editorHelper.openProfileComponentContextStructureEditor<IProfileComponentContext, OpenContextStructureEditor>(
    ProfileComponentActionTypes.OpenContextStructureEditor,
    fromIgamtDisplaySelectors.selectContextById,
    this.store.select(fromIgamtSelectedSelectors.selectProfileComponentContext),
    'Profile Component Context not found',
  );

  constructor(private actions$: Actions<ProfileComponentActions>,   private store: Store<any>,
              private message: MessageService,
              private deltaService: DeltaService,
              private profileComponentService: ProfileComponentService,
              private editorHelper: OpenEditorService,
              private conformanceStatementService: ConformanceStatementService,
              private crossReferenceService: CrossReferencesService) {

  }

}
