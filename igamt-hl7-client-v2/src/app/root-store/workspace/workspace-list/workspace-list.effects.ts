import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, finalize, flatMap } from 'rxjs/operators';
import { Message } from 'src/app/modules/dam-framework/models/messages/message.class';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { WorkspaceListService } from 'src/app/modules/workspace/services/workspace-list.service';
import {
  DeleteWorkspaceListItemRequest,
  DeleteWorkspaceListItemSuccess,
  LoadWorkspaceList,
  UpdatePendingInvitationCount,
  UpdateWorkspaceList,
  WorkspaceListActionTypes,
} from './workspace-list.actions';

@Injectable()
export class WorkspaceListEffects {

  @Effect()
  loadWorkspaceList$ = this.actions$.pipe(
    ofType(WorkspaceListActionTypes.LoadWorkspaceList),
    concatMap((action: LoadWorkspaceList) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return this.workspaceListService.fetchWorkspaceList(action.payload.type).pipe(
        flatMap((items) => {
          return this.workspaceListService.getWorkspacesPendingCount().pipe(
            flatMap((countResult) => {
              return [
                new fromDAM.TurnOffLoader(),
                new UpdateWorkspaceList(items),
                new UpdatePendingInvitationCount(countResult),
              ];
            }),
          );
        }),
        catchError((error) => {
          return this.catchErrorOf(error);
        }),
        finalize(() => {
          return new fromDAM.TurnOffLoader();
        }),
      );
    }),
  );
  @Effect()
  deleteWorkspace$ = this.actions$.pipe(
    ofType(WorkspaceListActionTypes.DeleteWorkspaceListItemRequest),
    concatMap((action: DeleteWorkspaceListItemRequest) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return this.workspaceListService.deleteWorkspace(action.id).pipe(
        flatMap((message: Message) => {
          return this.workspaceListService.getWorkspacesPendingCount().pipe(
            flatMap((countResult) => {
              return [
                new fromDAM.TurnOffLoader(),
                new DeleteWorkspaceListItemSuccess(action.id),
                this.message.messageToAction(message),
                new UpdatePendingInvitationCount(countResult),
              ];
            }),
          );
        }),
        catchError((error) => {
          return this.catchErrorOf(error);
        }),
      );
    }),
  );

  constructor(
    private actions$: Actions,
    private workspaceListService: WorkspaceListService,
    private store: Store<any>,
    private message: MessageService,
  ) {
  }

  catchErrorOf(error: any) {
    return of(
      new fromDAM.TurnOffLoader(),
      this.message.actionFromError(error),
    );
  }

}
