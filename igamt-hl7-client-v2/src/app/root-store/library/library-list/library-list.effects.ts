import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, flatMap } from 'rxjs/operators';
import { Message } from 'src/app/modules/dam-framework/models/messages/message.class';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { LibraryListService } from 'src/app/modules/library/services/library-list.service';
import {
  DeleteLibraryListItemRequest,
  DeleteLibraryListItemSuccess,
  LibraryListActionTypes,
  LoadLibraryList,
  UpdateLibraryList,
} from './library-list.actions';

@Injectable()
export class LibraryListEffects {

  @Effect()
  loadLibraryList$ = this.actions$.pipe(
    ofType(LibraryListActionTypes.LoadLibraryList),
    concatMap((action: LoadLibraryList) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return this.libraryListService.fetchLibraryList(action.payload.type).pipe(
        flatMap((items) => {
          return [
            new fromDAM.TurnOffLoader(),
            new UpdateLibraryList(items),
          ];
        }),
        catchError((error) => {
          return this.catchErrorOf(error);
        }),
      );
    }),
  );
  @Effect()
  deleteLibrary$ = this.actions$.pipe(
    ofType(LibraryListActionTypes.DeleteLibraryListItemRequest),
    concatMap((action: DeleteLibraryListItemRequest) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return this.libraryListService.deleteLibrary(action.id).pipe(
        flatMap((message: Message) => {
          return [
            new fromDAM.TurnOffLoader(),
            new DeleteLibraryListItemSuccess(action.id),
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
    private libraryListService: LibraryListService,
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
