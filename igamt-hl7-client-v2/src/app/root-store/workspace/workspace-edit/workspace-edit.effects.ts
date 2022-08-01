import { Store } from '@ngrx/store';
import { catchError, flatMap, take, switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { WorkspaceEditActionTypes, WorkspaceEditResolverLoad, WorkspaceEditResolverLoadSuccess, WorkspaceEditResolverLoadFailure, WorkspaceEditActions } from './workspace-edit.actions';
import { WorkspaceService } from './../../../modules/workspace/services/workspace.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { DamWidgetEffect } from './../../../modules/dam-framework/store/dam-widget-effect.class';
import { Injectable } from "@angular/core";
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import {ActivatedRoute, Router} from '@angular/router';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import { WORKSPACE_EDIT_WIDGET_ID } from 'src/app/modules/workspace/components/workspace-edit/workspace-edit.component';
import { IWorkspaceDisplayInfo } from 'src/app/modules/workspace/models/models';

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
        flatMap((workspaceInfo: IWorkspaceDisplayInfo) => {
          return [
            new fromDAM.TurnOffLoader(),
            new fromDAM.LoadPayloadData(workspaceInfo.workspace),
            this.workspaceService.loadRepositoryFromWorkspaceDisplayInfo(workspaceInfo),
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
  workspaceEditResolverLoadFailure$ = this.actions$.pipe(
    ofType(WorkspaceEditActionTypes.WorkspaceEditResolverLoadFailure),
    map((action: WorkspaceEditResolverLoadFailure) => {
      return this.message.actionFromError(action.error);
    }),
  );
}
