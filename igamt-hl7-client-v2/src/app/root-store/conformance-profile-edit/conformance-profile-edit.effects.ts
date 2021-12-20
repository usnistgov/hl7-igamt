import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, flatMap, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import * as fromDamActions from 'src/app/modules/dam-framework/store/data/dam.actions';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { IConformanceProfile } from 'src/app/modules/shared/models/conformance-profile.interface';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import * as fromIgamtSelectedSelectors from 'src/app/root-store/dam-igamt/igamt.selected-resource.selectors';
import * as fromIgamtSelectors from 'src/app/root-store/dam-igamt/igamt.selectors';
import { ConformanceProfileService } from '../../modules/conformance-profile/services/conformance-profile.service';
import { IConformanceStatementEditorData } from '../../modules/core/components/conformance-statement-editor/conformance-statement-editor.component';
import { OpenEditorService } from '../../modules/core/services/open-editor.service';
import { MessageService } from '../../modules/dam-framework/services/message.service';
import { SetValue } from '../../modules/dam-framework/store/data/dam.actions';
import { Type } from '../../modules/shared/constants/type.enum';
import { BindingService } from '../../modules/shared/services/binding.service';
import { DeltaService } from '../../modules/shared/services/delta.service';
import {SlicingService} from '../../modules/shared/services/slicing.service';
import {
  ConformanceProfileEditActions,
  ConformanceProfileEditActionTypes,
  LoadConformanceProfile,
  LoadConformanceProfileFailure,
  LoadConformanceProfileSuccess,
  OpenConformanceProfilePostDefEditor,
  OpenConformanceProfilePreDefEditor, OpenConformanceProfileSlicingEditor,
} from './conformance-profile-edit.actions';
import { OpenConformanceProfileBindingsEditor, OpenConformanceProfileCoConstraintBindingsEditor, OpenConformanceProfileDeltaEditor, OpenConformanceProfileMetadataEditor, OpenConformanceProfileStructureEditor, OpenCPConformanceStatementEditor } from './conformance-profile-edit.actions';
import { IState } from './conformance-profile-edit.reducer';

@Injectable()
export class ConformanceProfileEditEffects {

  @Effect()
  loadConformanceProfile$ = this.actions$.pipe(
    ofType(ConformanceProfileEditActionTypes.LoadConformanceProfile),
    concatMap((action: LoadConformanceProfile) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return this.conformanceProfileService.getById(action.id).pipe(
        flatMap((conformanceProfile: IConformanceProfile) => {
          return [
            new fromDAM.TurnOffLoader(),
            new SetValue({
              selected: conformanceProfile,
            }),
            new LoadConformanceProfileSuccess(conformanceProfile),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
          return of(
            new fromDAM.TurnOffLoader(),
            new LoadConformanceProfileFailure(error),
          );
        }),
      );
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
      return this.store.select(fromIgamtSelectedSelectors.selectedConformanceProfile)
        .pipe(
          take(1),
          flatMap((conformanceProfile) => {
            return this.store.select(fromIgamtDisplaySelectors.selectMessagesById, { id: conformanceProfile.id }).pipe(
              take(1),
              map((messageDisplay) => {
                return new fromDamActions.OpenEditor({
                  id: action.payload.id,
                  display: messageDisplay,
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
  openMessageCoConstraintBindingsEditor$ = this.editorHelper.openCoConstraintsBindingEditor<IConformanceProfile, OpenConformanceProfileCoConstraintBindingsEditor>(
    ConformanceProfileEditActionTypes.OpenConformanceProfileCoConstraintBindingsEditor,
    Type.CONFORMANCEPROFILE,
    fromIgamtDisplaySelectors.selectMessagesById,
    this.store.select(fromIgamtSelectedSelectors.selectedConformanceProfile),
    this.ConfPNotFound,
  );

  @Effect()
  openMessageStructureEditor$ = this.editorHelper.openStructureEditor<IConformanceProfile, OpenConformanceProfileStructureEditor>(
    ConformanceProfileEditActionTypes.OpenConformanceProfileStructureEditor,
    Type.CONFORMANCEPROFILE,
    fromIgamtDisplaySelectors.selectMessagesById,
    this.store.select(fromIgamtSelectedSelectors.selectedConformanceProfile),
    this.ConfPNotFound,
  );

  @Effect()
  openConformanceProfilePreDefEditor$ = this.editorHelper.openDefEditorHandler<string, OpenConformanceProfilePreDefEditor>(
    ConformanceProfileEditActionTypes.OpenConformanceProfilePreDefEditor,
    fromIgamtDisplaySelectors.selectMessagesById,
    this.store.select(fromIgamtSelectedSelectors.selectedResourcePreDef),
    this.ConfPNotFound,
  );

  @Effect()
  openConformanceProfilePostDefEditor$ = this.editorHelper.openDefEditorHandler<string, OpenConformanceProfilePostDefEditor>(
    ConformanceProfileEditActionTypes.OpenConformanceProfilePostDefEditor,
    fromIgamtDisplaySelectors.selectMessagesById,
    this.store.select(fromIgamtSelectedSelectors.selectedResourcePostDef),
    this.ConfPNotFound,
  );

  @Effect()
  openConformanceStatementEditor$ = this.editorHelper.openConformanceStatementEditor<IConformanceStatementEditorData, OpenCPConformanceStatementEditor>(
    ConformanceProfileEditActionTypes.OpenCPConformanceStatementEditor,
    Type.CONFORMANCEPROFILE,
    fromIgamtDisplaySelectors.selectMessagesById,
    (action: fromDamActions.OpenEditorBase) => {
      return this.store.select(fromIgamtSelectors.selectLoadedDocumentInfo).pipe(
        take(1),
        mergeMap((documentInfo) => {
          return this.conformanceProfileService.getConformanceStatementEditorData(action.payload.id, documentInfo);
        }),
      );
    },
    this.ConfPNotFound,
  );

  @Effect()
  openCpBindingsEditor$ = this.editorHelper.openBindingsEditor<IConformanceProfile, OpenConformanceProfileBindingsEditor>(
    ConformanceProfileEditActionTypes.OpenConformanceProfileBindingsEditor,
    Type.CONFORMANCEPROFILE,
    fromIgamtDisplaySelectors.selectMessagesById,
    this.store.select(fromIgamtSelectedSelectors.selectedConformanceProfile),
    (id, type) => {
      return this.bindingService.getResourceBindings(type, id);
    },
    this.ConfPNotFound,
  );

  @Effect()
  openSlicingEditor$ = this.editorHelper.openSlicingEditor<IConformanceProfile, OpenConformanceProfileSlicingEditor>(
    ConformanceProfileEditActionTypes.OpenConformanceProfileSlicingEditor,
    Type.CONFORMANCEPROFILE,
    fromIgamtDisplaySelectors.selectMessagesById,
    this.store.select(fromIgamtSelectedSelectors.selectedConformanceProfile),
    (id, type) => {
      return this.slicingService.getResoureSlicing(Type.CONFORMANCEPROFILE, id);
    },
    this.ConfPNotFound,
  );
  @Effect()
  openDeltaEditor$ = this.editorHelper.openDeltaEditor<OpenConformanceProfileDeltaEditor>(
    ConformanceProfileEditActionTypes.OpenConformanceProfileDeltaEditor,
    Type.CONFORMANCEPROFILE,
    fromIgamtDisplaySelectors.selectMessagesById,
    this.deltaService.getDeltaFromOrigin,
    this.ConfPNotFound,
  );

  constructor(
    private actions$: Actions<ConformanceProfileEditActions>,
    private store: Store<IState>,
    private message: MessageService,
    private deltaService: DeltaService,
    private bindingService: BindingService,
    private conformanceProfileService: ConformanceProfileService,
    private editorHelper: OpenEditorService,
    private slicingService: SlicingService) { }

}
