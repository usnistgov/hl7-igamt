import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import {concatMap, map} from 'rxjs/operators';
import { ProfileComponentActions, ProfileComponentActionTypes } from './profile-component.actions';

@Injectable()
export class ProfileComponentEffects {
  // @Effect()
  // loadProfileComponents$ = this.actions$.pipe(
  //   ofType(ProfileComponentActionTypes.OpenProfileComponent),
  //   map(((a) =>  a),
  // ));
  constructor(private actions$: Actions<ProfileComponentActions>) {}

}
