import { Injectable } from '@angular/core';
import { IUserConfig } from './../../modules/shared/models/config.class';

import { HttpErrorResponse } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { Message } from '../../modules/dam-framework/models/messages/message.class';
import { RxjsStoreHelperService } from '../../modules/dam-framework/services/rxjs-store-helper.service';
import { Hl7Config } from '../../modules/shared/models/config.class';
import { ConfigService } from '../../modules/shared/services/config.service';

import { EMPTY } from 'rxjs';
import { LoadUserConfig, LoadUserConfigFailure, LoadUserConfigSuccess, SaveUserConfig, SaveUserConfigFailure, SaveUserConfigSuccess, UserConfigActions, UserConfigActionTypes } from './user-config.actions';

@Injectable()
export class UserConfigEffects {

  @Effect()
  loadConfig$ = this.actions$.pipe(
    ofType(UserConfigActionTypes.LoadUserConfig),
    concatMap((action: LoadUserConfig) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: false,
      }));
      return this.configService.getUserConfig().pipe(
        map((resp: Message<IUserConfig>) => {
          return new LoadUserConfigSuccess(resp);
        })
        , catchError(
          (err: HttpErrorResponse) => {
            return of(new LoadUserConfigFailure(err));
          }),
      );
    }),
  );

  @Effect()
  loadConfigFailure$ = this.actions$.pipe(
    ofType(UserConfigActionTypes.LoadUserConfigFailure),
    this.helper.finalize<LoadUserConfigFailure, HttpErrorResponse>({
      clearMessages: true,
      turnOffLoader: true,
      message: (action: LoadUserConfigFailure) => {
        return action.payload;
      },
    }),
  );
  @Effect()
  loadConfigSuccess$ = this.actions$.pipe(
    ofType(UserConfigActionTypes.LoadUserConfigSuccess),
    this.helper.finalize<LoadUserConfigSuccess, Message<IUserConfig>>({
      clearMessages: true,
      turnOffLoader: true,
    }),
  );

  @Effect()
  saveConfigSuccess$ = this.actions$.pipe(
    ofType(UserConfigActionTypes.SaveUserConfigSuccess),
    this.helper.finalize<SaveUserConfigSuccess, Message<IUserConfig>>({
      clearMessages: true,
      turnOffLoader: true,
    }),
  );

  @Effect()
  saveConfig$ = this.actions$.pipe(
    ofType(UserConfigActionTypes.SaveUserConfig),
    concatMap((action: SaveUserConfig) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: false,
      }));
      return this.configService.saveUserConfig(action.payload).pipe(
        map((resp: Message<IUserConfig>) => {
          return new SaveUserConfigSuccess(resp);
        })
        , catchError(
          (err: HttpErrorResponse) => {
            return of(new SaveUserConfigFailure(err));
          }),
      );
    }),
  );

  constructor(
    private actions$: Actions<UserConfigActions>,
    private store: Store<any>,
    private configService: ConfigService,
    private helper: RxjsStoreHelperService,
  ) {
  }

}
