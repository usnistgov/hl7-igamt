import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { User } from 'src/app/modules/core/models/user/user.class';
import { RxjsStoreHelperService } from 'src/app/modules/shared/services/rxjs-store-helper.service';
import { Message } from '../../modules/core/models/message/message.class';
import { RegistrationService } from '../../modules/core/services/registration.service';
import { TurnOnLoader } from '../loader/loader.actions';
import {
  RegistrationActionTypes,
  RegistrationFailure,
  RegistrationRequest,
  RegistrationSuccess,
} from './registration.actions';

@Injectable()
export class RegistrationEffects {

  constructor(
    private actions$: Actions,
    private registrationService: RegistrationService,
    private store: Store<any>,
    private helper: RxjsStoreHelperService,
  ) { }

  @Effect()
  registration$ = this.actions$.pipe(
    ofType(RegistrationActionTypes.RegistrationRequest),
    concatMap((action: RegistrationRequest) => {
      this.store.dispatch(new TurnOnLoader({
        blockUI: false,
      }));
      return this.registrationService.register(action.payload).pipe(
        map((response: Message<User>) => {
          return new RegistrationSuccess(response);
        }),
        catchError((error: HttpErrorResponse) => {
          return of(new RegistrationFailure(error));
        }),
      );
    }),
  );

  @Effect()
  registrationSuccess$ = this.actions$.pipe(
    ofType(RegistrationActionTypes.RegistrationSuccess),
    this.helper.finalize<RegistrationSuccess, Message>({
      clearMessages: true,
      turnOffLoader: true,
      message: (action: RegistrationSuccess): Message => {
        return action.payload;
      },
    }),
  );

  @Effect()
  registrationFailure$ = this.actions$.pipe(
    ofType(RegistrationActionTypes.RegistrationFailure),
    this.helper.finalize<RegistrationFailure, HttpErrorResponse>({
      clearMessages: true,
      turnOffLoader: true,
      message: (action: RegistrationFailure): HttpErrorResponse => {
        return action.payload;
      },
    }),
  );
}
