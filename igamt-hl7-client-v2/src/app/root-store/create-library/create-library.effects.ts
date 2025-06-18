import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { Message } from '../../modules/dam-framework/models/messages/message.class';
import { RxjsStoreHelperService } from '../../modules/dam-framework/services/rxjs-store-helper.service';
import { IgService } from '../../modules/ig/services/ig.service';
import { LibraryService } from '../../modules/library/services/library.service';
import {
  CreateLibrary,
  CreateLibraryActions,
  CreateLibraryActionTypes,
  CreateLibraryFailure,
  CreateLibrarySuccess,
} from './create-library.actions';

@Injectable()
export class CreateLibraryEffects {
  @Effect()
  createLibrary$ = this.actions$.pipe(
    ofType(CreateLibraryActionTypes.CreateLibrary),
    mergeMap((action: CreateLibrary) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: false,
      }));
      return this.libraryService.create(action.payload).pipe(
        map((resp: Message<string>) => {
          return new CreateLibrarySuccess(resp);
        })
        , catchError(
          (err: HttpErrorResponse) => {
            return of(new CreateLibraryFailure(err));
          })
        ,
      );
    }),
  );
  @Effect()
  createIgFailure$ = this.actions$.pipe(
    ofType(CreateLibraryActionTypes.CreateLibraryFailure),
    this.helper.finalize<CreateLibraryFailure, HttpErrorResponse>({
      clearMessages: true,
      turnOffLoader: true,
      message: (action: CreateLibraryFailure) => {
        return action.payload;
      },
    }),
  );
  @Effect()
  createLibrarySucess$ = this.actions$.pipe(
    ofType(CreateLibraryActionTypes.CreateLibrarySuccess),
    map((action: CreateLibrarySuccess) => {
      this.router.navigate(['/datatype-library/' + action.payload.data]);
      return action;
    }),
    this.helper.finalize<CreateLibrarySuccess, Message<string>>({
      clearMessages: true,
      turnOffLoader: true,
      message: (action: CreateLibrarySuccess) => {
        return action.payload;
      },
    }),
  );
  constructor(
    private actions$: Actions<CreateLibraryActions>,
    private libraryService: LibraryService,
    private store: Store<any>,
    private helper: RxjsStoreHelperService,
    private router: Router) {
  }
}
