import {HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {catchError, concatMap, flatMap, map, mergeMap, take} from 'rxjs/operators';
import {MessageService} from '../../modules/dam-framework/services/message.service';
import * as fromDAM from '../../modules/dam-framework/store';
import {IResource} from '../../modules/shared/models/resource.interface';
import {ResourceService} from '../../modules/shared/services/resource.service';
import {
  IgamtLoadedResourcesActions,
  IgamtLoadedResourcesActionTypes,
  LoadResourceReferences,
  LoadResourceReferencesFailure,
  LoadResourceReferencesSuccess,

} from './igamt.loaded-resources.actions';
import {selectLoadedDocumentInfo} from './igamt.selectors';

@Injectable()
export class LoadedResourcesEffects {

  @Effect()
  loadReferences$ = this.actions$.pipe(
    ofType(IgamtLoadedResourcesActionTypes.LoadResourceReferences),
    concatMap((action: LoadResourceReferences) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: true,
      }));
      return this.store.select(selectLoadedDocumentInfo).pipe(
        take(1),
        mergeMap((document) => {
          return this.resourceService.getResources(action.payload.id, action.payload.resourceType, document.documentId, document.type).pipe(
            take(1),
            flatMap((resources: IResource[]) => {
              return [
                new fromDAM.TurnOffLoader(),
                new fromDAM.InsertResourcesInRepostory({
                  collections: [{
                    key: 'resources',
                    values: resources,
                  }],
                }),
                new LoadResourceReferencesSuccess(resources),
              ];
            }),
            catchError((error: HttpErrorResponse) => {
              return of(
                new fromDAM.TurnOffLoader(),
                new LoadResourceReferencesFailure(error),
              );
            }),
          );
        }),
      );
    }));

  @Effect()
  loadReferencesFailure$ = this.actions$.pipe(
    ofType(IgamtLoadedResourcesActionTypes.LoadResourceReferencesFailure),
    map((action: LoadResourceReferencesFailure) => {
      return this.message.actionFromError(action.error);
    }),
  );

  constructor(
    private actions$: Actions<IgamtLoadedResourcesActions>,
    private store: Store<any>,
    private message: MessageService,
    private resourceService: ResourceService) {

  }

}
