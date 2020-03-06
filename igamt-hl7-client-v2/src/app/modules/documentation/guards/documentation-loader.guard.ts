import {Injectable, Type} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Actions, ofType} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {Observable, of, ReplaySubject} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {IState} from '../../../root-store/conformance-profile-edit/conformance-profile-edit.reducer';

@Injectable({
  providedIn: 'root',
})
export class DocumentationLoaderGuard implements CanActivate {
  constructor(
    private store: Store<IState>,
    private router: Router,
    private actions$: Actions) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const LoadAction: Type<Action> = route.data.loadAction;
    const SuccessAction: string = route.data.successAction;
    const FailureAction: string = route.data.failureAction;
    const redirectTo: string[] = route.data.redirectTo;

    if (!LoadAction || !SuccessAction || !FailureAction || !redirectTo) {
      console.error('One of the data parameters was not provided for the route { routeParam, loadAction, successAction, failureAction, redirectTo }');
      return of(false);
    }

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

    this.store.dispatch(new LoadAction());
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
