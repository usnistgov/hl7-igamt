import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { filter, map } from 'rxjs/operators';
import {
  DamActionTypes,
  DeleteResourcesFromRepostory,
  InsertResourcesInRepostory,
  LoadResourcesInRepostory,
  RepositoryActionReduced,
} from './dam.actions';

@Injectable()
export class DamEffects {

  constructor(private actions$: Actions) { }

  @Effect()
  afterEffect$ = this.actions$.pipe(
    ofType(...[
      DamActionTypes.LoadResourcesInRepostory,
      DamActionTypes.InsertResourcesInRepostory,
      DamActionTypes.DeleteResourcesFromRepostory,
    ]),
    filter((action: LoadResourcesInRepostory | DeleteResourcesFromRepostory | InsertResourcesInRepostory) => !!action.payload.tag),
    map((action: LoadResourcesInRepostory | DeleteResourcesFromRepostory | InsertResourcesInRepostory) => {
      return new RepositoryActionReduced({
        tag: action.payload.tag,
      });
    }),
  );
}
