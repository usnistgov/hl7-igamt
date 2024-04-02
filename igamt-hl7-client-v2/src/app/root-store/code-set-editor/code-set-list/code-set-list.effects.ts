import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, finalize, flatMap } from 'rxjs/operators';
import { CodeSetServiceService } from 'src/app/modules/code-set-editor/services/CodeSetService.service';
import { Message } from 'src/app/modules/dam-framework/models/messages/message.class';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import {
  CodeSetListActionTypes,
  DeleteCodeSetListItemRequest,
  DeleteCodeSetListItemSuccess,
  LoadCodeSetList,
  UpdateCodeSetList,
  UpdatePendingInvitationCount,
} from './code-set-list.actions';

@Injectable()
export class CodeSetListEffects {

  @Effect()
  loadCodeSetList$ = this.actions$.pipe(
    ofType(CodeSetListActionTypes.LoadCodeSetList),
    concatMap((action: LoadCodeSetList) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return this.codeSetService.fetchCodeSetList(action.payload.type).pipe(
        flatMap((items) => {

              return [
                new fromDAM.TurnOffLoader(),
                new UpdateCodeSetList(items),
              ];

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
  deleteCodeSet$ = this.actions$.pipe(
    ofType(CodeSetListActionTypes.DeleteCodeSetListItemRequest),
    concatMap((action: DeleteCodeSetListItemRequest) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return this.codeSetService.deleteCodeSet(action.id).pipe(
        flatMap((message: Message) => {
              return [
                new fromDAM.TurnOffLoader(),
                new DeleteCodeSetListItemSuccess(action.id),
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
    private codeSetService: CodeSetServiceService,
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
