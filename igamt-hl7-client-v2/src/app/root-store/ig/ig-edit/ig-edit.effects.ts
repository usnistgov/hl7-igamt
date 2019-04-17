import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, flatMap, map, switchMap } from 'rxjs/operators';
import { MessageService } from 'src/app/modules/core/services/message.service';
import { IgService } from 'src/app/modules/ig/services/ig.service';
import { TurnOffLoader, TurnOnLoader } from '../../loader/loader.actions';
import {
  IgEditActions,
  IgEditActionTypes,
  IgEditResolverLoad,
  IgEditResolverLoadFailure,
  IgEditResolverLoadSuccess,
} from './ig-edit.actions';

@Injectable()
export class IgEditEffects {

  @Effect()
  igEditResolverLoad$ = this.actions$.pipe(
    ofType(IgEditActionTypes.IgEditResolverLoad),
    switchMap((action: IgEditResolverLoad) => {
      this.store.dispatch(new TurnOnLoader({
        blockUI: true,
      }));

      return this.igService.getIg(action.id).pipe(
        flatMap((ig: IgDocument) => {
          return [
            new TurnOffLoader(),
            new IgEditResolverLoadSuccess(ig),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
          return of(
            new TurnOffLoader(),
            new IgEditResolverLoadFailure(error),
          );
        }),
      );
    }),
  );

  @Effect()
  igEditResolverLoadFailure$ = this.actions$.pipe(
    ofType(IgEditActionTypes.IgEditResolverLoadFailure),
    map((action: IgEditResolverLoadFailure) => {
      return this.message.actionFromError(action.error);
    }),
  );

  constructor(
    private actions$: Actions<IgEditActions>,
    private igService: IgService,
    private store: Store<any>,
    private message: MessageService,
  ) { }

}
