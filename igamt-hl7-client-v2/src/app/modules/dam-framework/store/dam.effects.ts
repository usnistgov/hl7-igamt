import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { DamActions } from './dam.actions';

@Injectable()
export class DamEffects {

  constructor(private actions$: Actions<DamActions>) { }
}
