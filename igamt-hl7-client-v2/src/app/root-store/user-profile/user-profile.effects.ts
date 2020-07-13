import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { User } from 'src/app/modules/dam-framework/models/authentication/user.class';
import { RxjsStoreHelperService } from 'src/app/modules/dam-framework/services/rxjs-store-helper.service';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { RegistrationService } from '../../modules/core/services/registration.service';
import { Message } from '../../modules/dam-framework/models/messages/message.class';
import {
  UserProfileActionTypes,
  UserProfileFailure,
  UserProfileRequest,
  UserProfileSuccess,
} from './user-profile.actions';

@Injectable()
export class UserProfileEffects {

  @Effect()
  registration$ = this.actions$.pipe(
    ofType(UserProfileActionTypes.UserProfileRequest),
    concatMap((action: UserProfileRequest) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: false,
      }));
      return this.registrationService.update(action.payload).pipe(
        map((response: Message<User>) => {
          return new UserProfileSuccess(response);
        }),
        catchError((error: HttpErrorResponse) => {
          return of(new UserProfileFailure(error));
        }),
      );
    }),
  );
  @Effect()
  registrationSuccess$ = this.actions$.pipe(
    ofType(UserProfileActionTypes.UserProfileSuccess),
    this.helper.finalize<UserProfileSuccess, Message>({
      clearMessages: true,
      turnOffLoader: true,
      message: (action: UserProfileSuccess): Message => {
        return action.payload;
      },
      handler: (action: UserProfileSuccess): Action[] => {
        this.router.navigate(['/']);
        return [];
      },
    }),
  );
  @Effect()
  registrationFailure$ = this.actions$.pipe(
    ofType(UserProfileActionTypes.UserProfileFailure),
    this.helper.finalize<UserProfileFailure, HttpErrorResponse>({
      clearMessages: true,
      turnOffLoader: true,
      message: (action: UserProfileFailure): HttpErrorResponse => {
        return action.payload;
      },
    }),
  );

  constructor(
    private actions$: Actions,
    private registrationService: RegistrationService,
    private store: Store<any>,
    private router: Router,
    private helper: RxjsStoreHelperService,
  ) {
  }
}
