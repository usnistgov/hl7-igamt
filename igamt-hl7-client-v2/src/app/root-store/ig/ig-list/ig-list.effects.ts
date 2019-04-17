import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, flatMap } from 'rxjs/operators';
import { Message } from 'src/app/modules/core/models/message/message.class';
import { MessageService } from 'src/app/modules/core/services/message.service';
import { IgListService } from 'src/app/modules/ig/services/ig-list.service';
import { RxjsStoreHelperService } from 'src/app/modules/shared/services/rxjs-store-helper.service';
import { TurnOffLoader, TurnOnLoader } from 'src/app/root-store/loader/loader.actions';
import { DeleteIgListItemRequest, DeleteIgListItemSuccess, IgListActionTypes, LoadIgList, UpdateIgList } from './ig-list.actions';

@Injectable()
export class IgListEffects {

  constructor(
    private actions$: Actions,
    private igListService: IgListService,
    private store: Store<any>,
    private helper: RxjsStoreHelperService,
    private message: MessageService,
  ) { }

  @Effect()
  loadIgList$ = this.actions$.pipe(
    ofType(IgListActionTypes.LoadIgList),
    concatMap((action: LoadIgList) => {
      this.store.dispatch(new TurnOnLoader({
        blockUI: true,
      }));
      return this.igListService.fetchIgList(action.payload.type).pipe(
        flatMap((items) => {
          return [
            new TurnOffLoader(),
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
      this.store.dispatch(new TurnOnLoader({
        blockUI: true,
      }));
      return this.igListService.deleteIg(action.id).pipe(
        flatMap((message: Message) => {
          return [
            new TurnOffLoader(),
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

  catchErrorOf(error: any) {
    return of(
      new TurnOffLoader(),
      this.message.actionFromError(error),
    );
  }

}
