import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { LibraryActions, LibraryActionTypes, LoadLibrary, LoadLibrarySuccess } from './library.actions';

@Injectable()
export class LibraryEffects {

  @Effect()
  loadLibrarys$ = this.actions$.pipe(
    ofType(LibraryActionTypes.LoadLibrary),
    map((action: LoadLibrary) => {
      return new LoadLibrarySuccess({ id: action.id });
    }),
  );

  constructor(private actions$: Actions<LibraryActions>) { }

}
