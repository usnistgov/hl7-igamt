import {HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {catchError, concatMap, flatMap, map, mergeMap, withLatestFrom} from 'rxjs/operators';
import {Message} from 'src/app/modules/core/models/message/message.class';
import {MessageService} from 'src/app/modules/core/services/message.service';
import {IgListService} from 'src/app/modules/document/services/ig-list.service';
import {RxjsStoreHelperService} from 'src/app/modules/shared/services/rxjs-store-helper.service';
import {TurnOffLoader, TurnOnLoader} from 'src/app/root-store/loader/loader.actions';
import {selectDocumentType} from '../document.reducer';
import {
  DeleteIgListItemRequest,
  DeleteIgListItemSuccess,
  IgListActionTypes,
  LoadIgList,
  UpdateIgList,
} from './document-list.actions';

@Injectable()
export class DocumentListEffects {

  @Effect()
  loadIgList$ = this.actions$.pipe(
    ofType(IgListActionTypes.LoadIgList),
    withLatestFrom(this.store.select(selectDocumentType)),
    mergeMap(([action, type]) => {
      this.store.dispatch(new TurnOnLoader({
        blockUI: true,
      }));
      return this.igListService.fetchIgList(action['payload']['type'], type).pipe(
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
    withLatestFrom(this.store.select(selectDocumentType)),
    concatMap(([action, type]) => {
      this.store.dispatch(new TurnOnLoader({
        blockUI: true,
      }));
      return this.igListService.deleteIg(action['id'], type).pipe(
        flatMap((message: Message) => {
          return [
            new TurnOffLoader(),
            new DeleteIgListItemSuccess(action['id']),
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
    private helper: RxjsStoreHelperService,
    private message: MessageService,
  ) {
  }

  catchErrorOf(error: any) {
    return of(
      new TurnOffLoader(),
      this.message.actionFromError(error),
    );
  }

}
