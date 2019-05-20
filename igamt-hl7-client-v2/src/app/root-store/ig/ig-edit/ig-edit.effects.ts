import {HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {catchError, flatMap, map, switchMap} from 'rxjs/operators';
import {MessageService} from 'src/app/modules/core/services/message.service';
import {IgService} from 'src/app/modules/ig/services/ig.service';
import {Message} from '../../../modules/core/models/message/message.class';
import {IGDisplayInfo} from '../../../modules/ig/models/ig/ig-document.class';
import {TurnOffLoader, TurnOnLoader} from '../../loader/loader.actions';
import {
  AddResourceFailure,
  AddResourceSuccess, CopyResource, CopyResourceSuccess,
  IgEditActions,
  IgEditActionTypes,
  IgEditResolverLoad,
  IgEditResolverLoadFailure,
  IgEditResolverLoadSuccess, IgEditTocAddResource,
} from './ig-edit.actions';
import {ICopyResourceResponse} from "../../../modules/ig/models/toc/toc-operation.class";

@Injectable()
export class IgEditEffects {

  @Effect()
  igEditResolverLoad$ = this.actions$.pipe(
    ofType(IgEditActionTypes.IgEditResolverLoad),
    switchMap((action: IgEditResolverLoad) => {
      this.store.dispatch(new TurnOnLoader({
        blockUI: true,
      }));

      return this.igService.getIgInfo(action.id).pipe(
        flatMap((igInfo: IGDisplayInfo) => {
          return [
            new TurnOffLoader(),
            new IgEditResolverLoadSuccess(igInfo),
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

  @Effect()
  igAddResourceFailure$ = this.actions$.pipe(
    ofType(IgEditActionTypes.AddResourceFailure),
    map((action: AddResourceFailure) => {
      return this.message.actionFromError(action.error);
    }),
  );

  @Effect()
  IgEditTocAddResource$ = this.actions$.pipe(
    ofType(IgEditActionTypes.IgEditTocAddResource),
    switchMap((action: IgEditTocAddResource) => {
      this.store.dispatch(new TurnOnLoader({
        blockUI: true,
      }));

      return this.igService.addResource(action.payload).pipe(
        flatMap((response: Message<IGDisplayInfo>) => {
          return [
            new TurnOffLoader(),
            new AddResourceSuccess(response.data),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
          return of(
            new TurnOffLoader(),
            new AddResourceFailure(error),
          );
        }),
      );
    }),
  );

  @Effect()
  IgCopyResource$ = this.actions$.pipe(
    ofType(IgEditActionTypes.CopyResource),
    switchMap((action: CopyResource) => {
      this.store.dispatch(new TurnOnLoader({
        blockUI: true,
      }));

      return this.igService.copyResource(action.payload).pipe(
        flatMap((response: Message<ICopyResourceResponse>) => {
          return [
            new TurnOffLoader(),
            new CopyResourceSuccess(response.data),
          ];
        }),
        catchError((error: HttpErrorResponse) => {
          return of(
            new TurnOffLoader(),
            new AddResourceFailure(error),
          );
        }),
      );
    }),
  );

  constructor(
    private actions$: Actions<IgEditActions>,
    private igService: IgService,
    private store: Store<any>,
    private message: MessageService,
  ) {
  }

}
