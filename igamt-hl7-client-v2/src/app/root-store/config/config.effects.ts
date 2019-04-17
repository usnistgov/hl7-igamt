import {HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {catchError, concatMap, map} from 'rxjs/operators';
import {Message} from '../../modules/core/models/message/message.class';
import {MessageService} from '../../modules/core/services/message.service';
import {Hl7Config} from '../../modules/shared/models/config.class';
import {ConfigService} from '../../modules/shared/services/config.service';
import {RxjsStoreHelperService} from '../../modules/shared/services/rxjs-store-helper.service';
import {TurnOnLoader} from '../loader/loader.actions';
import {ConfigActions, ConfigActionTypes, LoadConfig, LoadConfigFailure, LoadConfigSuccess} from './config.actions';

@Injectable()
export class ConfigEffects {
  @Effect()
  loadConfig$ = this.actions$.pipe(
    ofType(ConfigActionTypes.LoadConfig),
    concatMap((action: LoadConfig) => {
      this.store.dispatch(new TurnOnLoader({
        blockUI: false,
      }));
      return this.configService.getConfig().pipe(
        map((resp: Message<Hl7Config>) => {
            return new LoadConfigSuccess(resp);
        })
        , catchError(
          (err: HttpErrorResponse) => {
            return of(new LoadConfigFailure(err));
          }),
      );
    }),
  );

  @Effect()
  loadConfigFailure$ = this.actions$.pipe(
    ofType(ConfigActionTypes.LoadConfigFailure),
    this.helper.finalize<LoadConfigFailure, HttpErrorResponse>({
      clearMessages: true,
      turnOffLoader: true,
      message: (action: LoadConfigFailure) => {
        return action.payload;
      },
    }),
  );
  @Effect()
  loadConfigSuccess$ = this.actions$.pipe(
    ofType(ConfigActionTypes.LoadConfigSuccess),
    this.helper.finalize<LoadConfigSuccess, Message<Hl7Config>>({
      clearMessages: true,
      turnOffLoader: true,
    }),
  );

  constructor(private actions$: Actions<ConfigActions>, private store: Store<any>, private configService: ConfigService,
              private message: MessageService,  private helper: RxjsStoreHelperService) {}

}
