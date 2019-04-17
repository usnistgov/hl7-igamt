import {HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {Message} from '../../modules/core/models/message/message.class';
import {MessageService} from '../../modules/core/services/message.service';
import {MessageEventTreeNode} from '../../modules/ig/models/message-event/message-event.class';
import {IgService} from '../../modules/ig/services/ig.service';
import {RxjsStoreHelperService} from '../../modules/shared/services/rxjs-store-helper.service';
import {TurnOnLoader} from '../loader/loader.actions';
import {
  CreateIg,
  CreateIgActions,
  CreateIgActionTypes, CreateIgFailure, CreateIgSuccess,
  LoadMessageEvents,
  LoadMessageEventsFailure,
  LoadMessageEventsSuccess,
} from './create-ig.actions';

@Injectable()
export class CreateIgEffects {

  @Effect()
  loadMessagesEvents$ = this.actions$.pipe(
    ofType(CreateIgActionTypes.LoadMessageEvents),
    mergeMap((action: LoadMessageEvents) => {
      this.store.dispatch(new TurnOnLoader({
        blockUI: false,
      }));
      return this.igService.getMessagesByVersion(action.payload).pipe(
        map((resp: Message<MessageEventTreeNode[]>) => {
         return new LoadMessageEventsSuccess(resp);
        })
        , catchError(
          (err: HttpErrorResponse) => {
            return of(new LoadMessageEventsFailure(err));
          })
        ,
      );
    }),
  );

  @Effect()
  createIg$ = this.actions$.pipe(
    ofType(CreateIgActionTypes.CreateIg),
    mergeMap((action: CreateIg) => {
      this.store.dispatch(new TurnOnLoader({
        blockUI: false,
      }));
      return this.igService.createIntegrationProfile(action.payload).pipe(
        map((resp: Message<string>) => {
          return new CreateIgSuccess(resp);
        })
        , catchError(
          (err: HttpErrorResponse) => {
            return of(new CreateIgFailure(err));
          })
        ,
      );
    }),
  );

  @Effect()
  loadMessageEventsFailure$ = this.actions$.pipe(
    ofType(CreateIgActionTypes.LoadMessageEventsFailure),
    this.helper.finalize<LoadMessageEventsFailure, HttpErrorResponse>({
      clearMessages: true,
      turnOffLoader: true,
      message: (action: LoadMessageEventsFailure) => {
        return action.payload;
      },
    }),
  );

  @Effect()
  createIgFailure$ = this.actions$.pipe(
    ofType(CreateIgActionTypes.CreateIgFailure),
    this.helper.finalize<CreateIgFailure, HttpErrorResponse>({
      clearMessages: true,
      turnOffLoader: true,
      message: (action: CreateIgFailure) => {
        return action.payload;
      },
    }),
  );
  @Effect()
  createIgSucess$ = this.actions$.pipe(
    ofType(CreateIgActionTypes.CreateIgSuccess),
    this.helper.finalize<CreateIgSuccess, Message<string>>({
      clearMessages: true,
      turnOffLoader: true,
      message: (action: CreateIgSuccess) => {
        return action.payload;
      },
    }),
  );
  @Effect()
  loadMessageEventsSuccess$ = this.actions$.pipe(
    ofType(CreateIgActionTypes.LoadMessageEventsSuccess),
    this.helper.finalize<LoadMessageEventsSuccess, HttpErrorResponse>({
      clearMessages: true,
      turnOffLoader: true,
    }),
  );
  constructor(private actions$: Actions<CreateIgActions>, private igService: IgService,
              private store: Store<any>, private message: MessageService, private helper: RxjsStoreHelperService) {
  }
}
