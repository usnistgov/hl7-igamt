import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { DamWidgetContainerComponent } from '../components/dam-widget-container/dam-widget-container.component';
import { selectWidgetId } from '../store/data/dam.selectors';

@Injectable()
export class WidgetDeactivateGuard implements CanDeactivate<DamWidgetContainerComponent> {

  constructor(
    private store: Store<any>,
  ) { }

  canDeactivate(component: DamWidgetContainerComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot) {
    console.log('CAN DEACTIVATE Widget [' + component.activeWidget.instance.widgetId + ']');

    // CLOSE WIDGET
    component.closeWidget();

    // CAN DEACTIVATE WHEN WIDGET ID IS CLEARED
    return this.store.select(selectWidgetId).pipe(
      map((id) => id !== component.activeWidget.instance.widgetId),
    );
  }
}
