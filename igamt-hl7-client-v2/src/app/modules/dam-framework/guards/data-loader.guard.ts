import { Injectable, Type } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of, ReplaySubject } from 'rxjs';
import { delay, filter, map, take, tap } from 'rxjs/operators';
import { selectWidgetId } from '../store/data/dam.selectors';

@Injectable({
  providedIn: 'root',
})
export class DataLoaderGuard implements CanActivate {

  constructor(
    private store: Store<any>,
    private router: Router,
    private actions$: Actions) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    console.log('CAN ACTIVATE DATA LOADER WAITING FOR ' + route.data.successAction);

    const routeParam: string = route.data.routeParam;
    const LoadAction: Type<Action> = route.data.loadAction;
    const SuccessAction: string = route.data.successAction;
    const FailureAction: string = route.data.failureAction;
    const redirectTo: string[] = route.data.redirectTo;

    if (!LoadAction || !SuccessAction || !FailureAction || !redirectTo) {
      console.error('One of the data parameters was not provided for the route { loadAction, successAction, failureAction, redirectTo }');
      return of(false);
    }

    const id = routeParam ? route.params[routeParam] : '';
    const subject: ReplaySubject<boolean> = new ReplaySubject<boolean>();
    this.actions$.pipe(
      ofType(SuccessAction, FailureAction),
      take(1),
      map((action: Action) => {
        switch (action.type) {
          case SuccessAction:
            subject.next(true);
            break;
          case FailureAction:
            subject.next(false);
            break;
        }
      }),
    ).subscribe();

    this.store.dispatch(new LoadAction(id));
    return subject.asObservable().pipe(
      map((result) => {
        if (result) {
          return true;
        } else {
          return this.router.createUrlTree(redirectTo);
        }
      }),
    );
  }

}
