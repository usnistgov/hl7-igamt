import {HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {catchError, concatMap, map, mergeMap, withLatestFrom} from 'rxjs/operators';
import {Message} from '../../modules/core/models/message/message.class';
import {MessageService} from '../../modules/core/services/message.service';
import {MessageEventTreeNode} from '../../modules/document/models/message-event/message-event.class';
import {IgService} from '../../modules/document/services/ig.service';
import {RxjsStoreHelperService} from '../../modules/shared/services/rxjs-store-helper.service';
import {selectDocumentType} from '../document/document.reducer';
import {TurnOnLoader} from '../loader/loader.actions';
import {
  CreateDocument,
  CreateDocumentActions,
  CreateDocumentActionTypes,
  CreateDocumentFailure,
  CreateDocumentSuccess,
  LoadMessageEvents,
  LoadMessageEventsFailure,
  LoadMessageEventsSuccess,
} from './create-document.actions';

@Injectable()
export class CreateDocumentEffects {

  @Effect()
  loadMessagesEvents$ = this.actions$.pipe(
    ofType(CreateDocumentActionTypes.LoadMessageEvents),
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
    ofType(CreateDocumentActionTypes.CreateDocument),
    withLatestFrom(this.store.select(selectDocumentType)),
    mergeMap(([action, type]) => {
      this.store.dispatch(new TurnOnLoader({
        blockUI: false,
      }));
      return this.igService.createDocument(action.payload, type).pipe(
        map((resp: Message<string>) => {
          console.log(resp);
          return new CreateDocumentSuccess(resp);
        })
        , catchError(
          (err: HttpErrorResponse) => {
            return of(new CreateDocumentFailure(err));
          })
        ,
      );
    }),
  );

  @Effect()
  loadMessageEventsFailure$ = this.actions$.pipe(
    ofType(CreateDocumentActionTypes.LoadMessageEventsFailure),
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
    ofType(CreateDocumentActionTypes.CreateDocumentFailure),
    this.helper.finalize<CreateDocumentFailure, HttpErrorResponse>({
      clearMessages: true,
      turnOffLoader: true,
      message: (action: CreateDocumentFailure) => {
        return action.payload;
      },
    }),
  );
  @Effect()
  createDocumentSucess$ = this.actions$.pipe(
    ofType(CreateDocumentActionTypes.CreateDocumentSuccess),
    map((action: CreateDocumentSuccess) => {
      this.router.navigate(['/ig/' + action.payload.data ]);
      return action;
    }),
    this.helper.finalize<CreateDocumentSuccess, Message<string>>({
      clearMessages: true,
      turnOffLoader: true,
      message: (action: CreateDocumentSuccess) => {
        return action.payload;
      },
    }),
  );
  @Effect()
  loadMessageEventsSuccess$ = this.actions$.pipe(
    ofType(CreateDocumentActionTypes.LoadMessageEventsSuccess),
    this.helper.finalize<LoadMessageEventsSuccess, HttpErrorResponse>({
      clearMessages: true,
      turnOffLoader: true,
    }),
  );

  constructor(private actions$: Actions<CreateDocumentActions>, private igService: IgService,
              private store: Store<any>, private message: MessageService, private helper: RxjsStoreHelperService, private router: Router) {
  }
}
