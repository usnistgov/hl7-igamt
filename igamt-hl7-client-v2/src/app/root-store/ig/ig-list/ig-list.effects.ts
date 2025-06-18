import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, flatMap } from 'rxjs/operators';
import { Message } from 'src/app/modules/dam-framework/models/messages/message.class';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { IgListService } from 'src/app/modules/ig/services/ig-list.service';
import {
  DeleteIgListItemRequest,
  DeleteIgListItemSuccess,
  IgListActionTypes,
  LoadIgList,
  LockIG,
  LockIGSuccess,
  UpdateIgList,
} from './ig-list.actions';

@Injectable()
export class IgListEffects {

  @Effect()
  loadIgList$ = this.actions$.pipe(
    ofType(IgListActionTypes.LoadIgList),
    concatMap((action: LoadIgList) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return this.igListService.fetchIgList(action.payload.type).pipe(
        flatMap((items) => {
          return [
            new fromDAM.TurnOffLoader(),
            new UpdateIgList(items),
          ];
        }),
        catchError((error) => {
          return this.catchErrorOf(error);
        }),
      );
    }),
  );
  @Effect()
  deleteIg$ = this.actions$.pipe(
    ofType(IgListActionTypes.DeleteIgListItemRequest),
    concatMap((action: DeleteIgListItemRequest) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return this.igListService.deleteIg(action.id).pipe(
        flatMap((message: Message) => {
          return [
            new fromDAM.TurnOffLoader(),
            new DeleteIgListItemSuccess(action.id),
            this.message.messageToAction(message),
          ];
        }),
        catchError((error) => {
          return this.catchErrorOf(error);
        }),
      );
    }),
  );

  @Effect()
  lockIG$ = this.actions$.pipe(
    ofType(IgListActionTypes.LockIG),
    concatMap((action: LockIG) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return this.igListService.lockIG(action.id).pipe(
        flatMap((message: Message) => {
          return [
            new fromDAM.TurnOffLoader(),
            new LockIGSuccess(action.id),
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
    private igListService: IgListService,
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
