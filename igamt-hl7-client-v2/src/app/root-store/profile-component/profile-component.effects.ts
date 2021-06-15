import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {combineLatest, Observable, of} from 'rxjs';
import {catchError, concatMap, flatMap, map, mergeMap, pluck, switchMap, take, withLatestFrom} from 'rxjs/operators';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import { IConformanceStatementList } from 'src/app/modules/shared/models/cs-list.interface';
import { PropertyType } from 'src/app/modules/shared/models/save-change';
import {selectDocument, selectLoadedDocumentInfo} from 'src/app/root-store/dam-igamt/igamt.selectors';
import * as fromIgamtSelectors from 'src/app/root-store/dam-igamt/igamt.selectors';
import { ConformanceProfileService } from '../../modules/conformance-profile/services/conformance-profile.service';
import { OpenEditorService } from '../../modules/core/services/open-editor.service';
import { MessageService } from '../../modules/dam-framework/services/message.service';
import { SetValue } from '../../modules/dam-framework/store';
import * as fromDAM from '../../modules/dam-framework/store';
import * as fromDamActions from '../../modules/dam-framework/store/data/dam.actions';
import * as fromRouterSelector from '../../modules/dam-framework/store/router/router.selectors';
import { IPcConformanceStatementEditorData } from '../../modules/profile-component/components/conformance-statement-editor/conformance-statement-editor.component';
import { ProfileComponentService } from '../../modules/profile-component/services/profile-component.service';
import { SegmentService } from '../../modules/segment/services/segment.service';
import {IDocumentRef} from '../../modules/shared/models/abstract-domain.interface';
import {IDisplayElement} from '../../modules/shared/models/display-element.interface';
import { IProfileComponent, IProfileComponentContext, IPropertyConformanceStatement } from '../../modules/shared/models/profile.component';
import {ISegment} from '../../modules/shared/models/segment.interface';
import * as fromIgamtDisplaySelectors from '../dam-igamt/igamt.resource-display.selectors';
import * as fromIgamtSelectedSelectors from '../dam-igamt/igamt.selected-resource.selectors';
import {
  OpenProfileComponentMessageConformanceStatementEditor,
  OpenProfileComponentSegmentConformanceStatementEditor,
  OpenSegmentContextDynamicMappingEditor
} from './profile-component.actions';
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

const CONTEXT_NOT_FOUND = 'Profile Component Context not found';

@Injectable()
export class ProfileComponentEffects {

  constructor(
    private actions$: Actions<ProfileComponentActions>,
    private store: Store<any>,
    private message: MessageService,
    private profileComponentService: ProfileComponentService,
    private editorHelper: OpenEditorService,
    private segmentService: SegmentService,
    private cpService: ConformanceProfileService) {
  }

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
    CONTEXT_NOT_FOUND,
  );

  @Effect()
  openSegmentConformanceStatementEditor$ = this.editorHelper.openConformanceStatementEditor<IPcConformanceStatementEditorData, OpenProfileComponentSegmentConformanceStatementEditor>(
    ProfileComponentActionTypes.OpenProfileComponentSegmentConformanceStatementEditor,
    Type.SEGMENT,
    fromIgamtDisplaySelectors.selectContextById,
    this.conformanceStatementEditor((id, doc) => {
      return this.segmentService.getConformanceStatements(id, doc);
    }),
    CONTEXT_NOT_FOUND,
  );

  @Effect()
  openMessageConformanceStatementEditor$ = this.editorHelper.openConformanceStatementEditor<IPcConformanceStatementEditorData, OpenProfileComponentMessageConformanceStatementEditor>(
    ProfileComponentActionTypes.OpenProfileComponentMessageConformanceStatementEditor,
    Type.CONFORMANCEPROFILE,
    fromIgamtDisplaySelectors.selectContextById,
    this.conformanceStatementEditor((id, doc) => {
      return this.cpService.getConformanceStatements(id, doc);
    }),
    CONTEXT_NOT_FOUND,
  );
  @Effect()
  openDynamicMappingEditor = this.actions$.pipe(
    ofType(ProfileComponentActionTypes.OpenSegmentContextDynamicMappingEditor),
    switchMap((action: OpenSegmentContextDynamicMappingEditor) => {
      return this.store.select(fromRouterSelector.selectRouteParams).pipe(
        take(1),
        pluck('pcId'),
        withLatestFrom(this.store.select(selectLoadedDocumentInfo)),
        flatMap(([pcId, documentRef]) => {
          return this.profileComponentService.getChildById(pcId as string, action.payload.id).pipe(
            concatMap((ctx) => {
              return this.segmentService.getById(ctx.sourceId).pipe(
                withLatestFrom(this.store.select(fromIgamtDisplaySelectors.selectContextById, { id: ctx.id })),
                map(([seg, display]) => {
                  return new fromDamActions.OpenEditor({
                    id: action.payload.id,
                    display,
                    editor: action.payload.editor,
                    initial: this.profileComponentService.getDynamicMappingEditorInfo(ctx, seg),
                  });
                }),
              );
            }),
          );
        }),
      );
    }),
  );

  conformanceStatementEditor(getter: (string, IDocumentRef) => Observable<IConformanceStatementList>) {
    return (action: fromDamActions.OpenEditorBase) => {
      return this.store.select(fromIgamtSelectors.selectLoadedDocumentInfo).pipe(
        take(1),
        mergeMap((documentInfo) => {
          return getter(action.payload.id, documentInfo);
        }),
        flatMap((data) => {
          return this.store.select(fromRouterSelector.selectRouteParams).pipe(
            take(1),
            pluck('pcId'),
            flatMap((pcId) => {
              return this.profileComponentService.getChildById(pcId as string, action.payload.id).pipe(
                map((ctx) => {
                  return {
                    conformanceStatements: data.conformanceStatements || [],
                    items: ctx.profileComponentBindings ?
                      (ctx.profileComponentBindings.contextBindings || [])
                        .filter((elm) => elm.propertyKey === PropertyType.STATEMENT)
                        .map((elm) => elm as IPropertyConformanceStatement) :
                      [],
                  };
                }),
              );
            }),
          );
        }),
      );
    };
  }

}
