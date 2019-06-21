import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import {HttpErrorResponse} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {catchError, concatMap, map, mergeMap} from 'rxjs/operators';
import {Message} from '../../modules/core/models/message/message.class';
import {MessageService} from '../../modules/core/services/message.service';

import {ResourceService} from '../../modules/shared/services/resource.service';
import {RxjsStoreHelperService} from '../../modules/shared/services/rxjs-store-helper.service';
import {
  CreateIgActions,
  LoadMessageEventsFailure,
  LoadMessageEventsSuccess,
} from '../create-ig/create-ig.actions';
import {TurnOnLoader} from '../loader/loader.actions';
import {
  LoadResource,
  LoadResourceSuccess,
  ResourceLoaderActionTypes,
} from './resource-loader.actions';

@Injectable()
export class ResourceLoaderEffects {

  @Effect()
  loadResource$ = this.actions$.pipe(
    ofType(ResourceLoaderActionTypes.LoadResource),
    mergeMap((action: LoadResource) => {
      this.store.dispatch(new TurnOnLoader({
        blockUI: false,
      }));
      return this.resourceService.getResource(action.payload).pipe(
        map((resp: Message<any[]> ) => {
          return new LoadResourceSuccess({response: resp, resourceInfo: action.payload});
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
  loadResourceFailure$ = this.actions$.pipe(
    ofType(ResourceLoaderActionTypes.LoadResourceFailure),
    this.helper.finalize<LoadMessageEventsFailure, HttpErrorResponse>({
      clearMessages: true,
      turnOffLoader: true,
      message: (action: LoadMessageEventsFailure) => {
        return action.payload;
      },
    }),
  );

  @Effect()
  loadMessageEventsSuccess$ = this.actions$.pipe(
    ofType(ResourceLoaderActionTypes.LoadResourceSuccess),
    this.helper.finalize<LoadMessageEventsSuccess, Message>({
      clearMessages: true,
      turnOffLoader: true,
    }),
  );

  constructor(private actions$: Actions<CreateIgActions>, private resourceService: ResourceService,
              private store: Store<any>, private message: MessageService, private helper: RxjsStoreHelperService) {
  }

}
