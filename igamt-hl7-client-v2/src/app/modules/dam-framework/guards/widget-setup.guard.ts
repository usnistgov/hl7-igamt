import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { InitWidgetId } from '../store/data/dam.actions';
import { selectWidgetId } from '../store/data/dam.selectors';

@Injectable()
export class WidgetSetupGuard implements CanActivate {
  constructor(
    private store: Store<any>) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    console.log('CAN ACTIVATE Widget Setup [' + route.data.widgetId + ']');

    // Get Necessary parameters from Route DATA
    const widgetId: string = route.data.widgetId;

    if (!widgetId) {
      throw new Error('Widget route must have data attribute widgetId declared');
    }

    // INIT WIDGET ID IN STORE
    this.store.dispatch(new InitWidgetId(widgetId));

    // CAN ACTIVATE WHEN STORE WIDGET ID IS SET
    return this.store.select(selectWidgetId).pipe(
      filter((id) => id === widgetId),
      take(1),
      map((id) => {
        return true;
      }),
    );

  }
}
