import { Actions, EffectNotification, ofType, OnRunEffects } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { exhaustMap, filter, takeUntil } from 'rxjs/operators';
import { ClearWidgetId, DamActionTypes, InitWidgetId } from './data/dam.actions';

export class DamWidgetEffect implements OnRunEffects {

  constructor(readonly widgetId: string, protected actions$: Actions<any>) { }

  ngrxOnRunEffects(resolvedEffects$: Observable<EffectNotification>) {
    return this.actions$.pipe(
      ofType(DamActionTypes.InitWidgetId),
      filter((action: InitWidgetId) => action.id === this.widgetId),
      exhaustMap(() =>
        resolvedEffects$.pipe(
          takeUntil(
            this.actions$.pipe(
              ofType(DamActionTypes.ClearWidgetId),
              filter((action: ClearWidgetId) => action.id === this.widgetId),
            ),
          ),
        ),
      ),
    );
  }
}
