import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CanActivate } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { catchError, filter, map, take } from 'rxjs/operators';
import * as fromIgEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { IgEditActionTypes } from '../../../root-store/ig/ig-edit/ig-edit.actions';
import { IgDocument } from '../models/ig/ig-document.class';

@Injectable({
  providedIn: 'root',
})
export class IgEditResolverService implements CanActivate {

  constructor(
    private store: Store<fromIgEdit.IState>,
    private router: Router,
    private actions$: Actions) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const igId = route.params['igId'];
    const subject: ReplaySubject<boolean> = new ReplaySubject<boolean>();
    this.actions$.pipe(
      ofType(IgEditActionTypes.IgEditResolverLoadSuccess, IgEditActionTypes.IgEditResolverLoadFailure),
      take(1),
      map((action: Action) => {
        switch (action.type) {
          case IgEditActionTypes.IgEditResolverLoadSuccess:
            subject.next(true);
            break;
          case IgEditActionTypes.IgEditResolverLoadFailure:
            subject.next(false);
            break;
        }
      }),
    ).subscribe();

    this.store.dispatch(new fromIgEdit.IgEditResolverLoad(igId));
    return subject.asObservable().pipe(
      map((result) => {
        if (result) {
          return true;
        } else {
          return this.router.createUrlTree(['ig', 'error']);
        }
      }),
    );
  }

}
