import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, flatMap } from 'rxjs/operators';
import { Message } from 'src/app/modules/dam-framework/models/messages/message.class';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { WorkspaceListService } from 'src/app/modules/workspace/services/workspace-list.service';
import {
  DeleteWorkspaceListItemRequest,
  DeleteWorkspaceListItemSuccess,
  WorkspaceListActionTypes,
  LoadWorkspaceList,
  UpdateWorkspaceList,
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
          return [
            new fromDAM.TurnOffLoader(),
            new UpdateWorkspaceList(items),
          ];
        }),
        catchError((error) => {
          return this.catchErrorOf(error);
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
          return [
            new fromDAM.TurnOffLoader(),
            new DeleteWorkspaceListItemSuccess(action.id),
            this.message.messageToAction(message),
          ];
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
