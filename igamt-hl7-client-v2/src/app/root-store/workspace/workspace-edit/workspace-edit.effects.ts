import { SetValue } from './../../../modules/dam-framework/store/data/dam.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, of } from 'rxjs';
import { catchError, concatMap, flatMap, map, switchMap, take } from 'rxjs/operators';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { WORKSPACE_EDIT_WIDGET_ID } from 'src/app/modules/workspace/components/workspace-edit/workspace-edit.component';
import { EditorSave } from '../../../modules/dam-framework/store/data/dam.actions';
import { IWorkspaceInfo } from '../../../modules/workspace/models/models';
import { DamWidgetEffect } from './../../../modules/dam-framework/store/dam-widget-effect.class';
import { WorkspaceService } from './../../../modules/workspace/services/workspace.service';
import { OpenWorkspaceAccessManagementEditor, OpenWorkspaceFolderEditor, OpenWorkspaceHomeEditor, OpenWorkspaceMetadataEditor, WorkspaceEditActions, WorkspaceEditActionTypes, WorkspaceEditResolverLoad, WorkspaceEditResolverLoadFailure, WorkspaceEditResolverLoadSuccess } from './workspace-edit.actions';
import { selectWorkspaceId } from './workspace-edit.selectors';

@Injectable()
export class WorkspaceEditEffects extends DamWidgetEffect {

  constructor(
    actions$: Actions<WorkspaceEditActions>,
    private workspaceService: WorkspaceService,
    private store: Store<any>,
    private message: MessageService,
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) {
    super(WORKSPACE_EDIT_WIDGET_ID, actions$);
  }

  @Effect()
  workspaceEditResolverLoad$ = this.actions$.pipe(
    ofType(WorkspaceEditActionTypes.WorkspaceEditResolverLoad),
    switchMap((action: WorkspaceEditResolverLoad) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));

      return this.workspaceService.getWorkspaceInfo(action.id).pipe(
        take(1),
        flatMap((workspaceInfo: IWorkspaceInfo) => {
          return [
            new fromDAM.TurnOffLoader(),
            ...this.workspaceService.getWorkspaceInfoUpdateAction(workspaceInfo),
            new WorkspaceEditResolverLoadSuccess(workspaceInfo),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
          console.log(error);
          return of(
            new fromDAM.TurnOffLoader(),
            new WorkspaceEditResolverLoadFailure(error),
          );
        }),
      );
    }),
  );

  @Effect()
  workspaceSave$ = this.actions$.pipe(
    ofType(fromDAM.DamActionTypes.GlobalSave),
    map((action: fromDAM.GlobalSave) => {
      return new EditorSave();
    }),
  );

  @Effect()
  workspaceEditResolverLoadFailure$ = this.actions$.pipe(
    ofType(WorkspaceEditActionTypes.WorkspaceEditResolverLoadFailure),
    map((action: WorkspaceEditResolverLoadFailure) => {
      return this.message.actionFromError(action.error);
    }),
  );

  @Effect()
  openWorkspaceHomeEditor$ = this.actions$.pipe(
    ofType(WorkspaceEditActionTypes.OpenWorkspaceHomeEditor),
    switchMap((action: OpenWorkspaceHomeEditor) => {
      return this.workspaceService.getWorkspaceInfo(action.payload.id).pipe(
        flatMap((wsInfo) => {
          return [
            ...this.workspaceService.getWorkspaceInfoUpdateAction(wsInfo),
            new fromDAM.OpenEditor({
              id: action.payload.id,
              display: {
                id: action.payload.id,
              },
              editor: action.payload.editor,
              initial: {
                value: wsInfo.homePageContent,
              },
            }),
          ];
        }),
      );
    }),
  );

  @Effect()
  OpenWorkspaceMetadataEditor$ = this.actions$.pipe(
    ofType(WorkspaceEditActionTypes.OpenWorkspaceMetadataEditor),
    switchMap((action: OpenWorkspaceMetadataEditor) => {
      return this.workspaceService.getWorkspaceInfo(action.payload.id).pipe(
        flatMap((wsInfo) => {
          return [
            ...this.workspaceService.getWorkspaceInfoUpdateAction(wsInfo),
            new fromDAM.OpenEditor({
              id: action.payload.id,
              display: {
                id: action.payload.id,
              },
              editor: action.payload.editor,
              initial: {
                ...wsInfo.metadata,
              },
            }),
          ];
        }),
      );
    }),
  );

  @Effect()
  OpenWorkspaceAccessManagementEditor$ = this.actions$.pipe(
    ofType(WorkspaceEditActionTypes.OpenWorkspaceAccessManagementEditor),
    switchMap((action: OpenWorkspaceFolderEditor) => {
      return this.store.select(selectWorkspaceId).pipe(
        take(1),
        flatMap((wsId) => {
          return combineLatest(
            this.workspaceService.getWorkspaceInfo(action.payload.id),
            this.workspaceService.getWorkspaceUsers(action.payload.id),
          ).pipe(
            flatMap(([wsInfo, users]) => {
              return [
                ...this.workspaceService.getWorkspaceInfoUpdateAction(wsInfo),
                new fromDAM.OpenEditor({
                  id: action.payload.id,
                  display: {
                    id: action.payload.id,
                  },
                  editor: action.payload.editor,
                  initial: {
                    users: [...users],
                  },
                }),
              ];
            }),
          );
        }),
      );
    }),
  );

  @Effect()
  OpenFolderEditor$ = this.actions$.pipe(
    ofType(WorkspaceEditActionTypes.OpenWorkspaceFolderEditor),
    switchMap((action: OpenWorkspaceFolderEditor) => {
      return this.store.select(selectWorkspaceId).pipe(
        take(1),
        flatMap((wsId) => {
          return combineLatest(
            this.workspaceService.getWorkspaceInfo(wsId),
            this.workspaceService.getWorkspaceFolderContent(wsId, action.payload.id),
          ).pipe(
            flatMap(([wsInfo, folder]) => {
              return [
                ...this.workspaceService.getWorkspaceInfoUpdateAction(wsInfo),
                new fromDAM.OpenEditor({
                  id: action.payload.id,
                  display: {
                    id: action.payload.id,
                    name: folder.metadata.title,
                  },
                  editor: action.payload.editor,
                  initial: {
                    ...folder,
                  },
                }),
              ];
            }),
          );
        }),
      );
    }),
  );

}
