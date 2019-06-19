import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import {HttpErrorResponse} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {EMPTY, of} from 'rxjs';
import {catchError, concatMap, map, mergeMap} from 'rxjs/operators';
import {Message} from '../../modules/core/models/message/message.class';
import {MessageService} from '../../modules/core/services/message.service';
import {IRelationShip} from '../../modules/shared/models/cross-reference';
import {CrossReferencesService} from '../../modules/shared/services/cross-references.service';
import {RxjsStoreHelperService} from '../../modules/shared/services/rxjs-store-helper.service';
import {LoadMessageEventsFailure} from '../create-ig/create-ig.actions';
import {TurnOnLoader} from '../loader/loader.actions';
import {
  ClearCrossRefs,
  CrossRefsActions,
  CrossRefsActionTypes,
  LoadCrossRefs, LoadCrossRefsFailure,
  LoadCrossRefsSuccess,
} from './cross-refs.actions';

@Injectable()
export class CrossRefsEffects {
  @Effect()
  loadCrossRefs$ = this.actions$.pipe(
    ofType(CrossRefsActionTypes.LoadCrossRefs),
    mergeMap((action: LoadCrossRefs) => {
      // this.store.dispatch(new TurnOnLoader({
      //   blockUI: false,
      // }));
      this.store.dispatch(new ClearCrossRefs());
      return this.crossReferenceService.findUsages(action.payload.documentId, action.payload.documentType, action.payload.elementType, action.payload.elementId).pipe(
        map((resp: Message<IRelationShip[]> ) => {
          return new LoadCrossRefsSuccess(resp);
        })
        , catchError(
          (err: HttpErrorResponse) => {
            return of(new LoadCrossRefsFailure(err));
          })
        ,
      );
    }),
  );

  constructor(private actions$: Actions<CrossRefsActions>, private store: Store<any>, private message: MessageService, private helper: RxjsStoreHelperService, private  crossReferenceService: CrossReferencesService ) {}

}
