import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree} from '@angular/router';
import {Observable, of, ReplaySubject} from 'rxjs';
import {Action, Store} from "@ngrx/store";
import {IState} from "../../root-store/conformance-profile-edit/conformance-profile-edit.reducer";
import {Actions, ofType} from "@ngrx/effects";
import {map, take} from "rxjs/operators";
import {DocumentActionTypes, ToggleType} from "../../root-store/document/document.actions";
import {Scope} from "../shared/constants/scope.enum";
import {IDocumentType} from "../document/document.type";
import {Type} from '../shared/constants/type.enum';
@Injectable({
  providedIn: 'root'
})
export class DocumentTypeGuard implements CanActivate {
  constructor(
    private store: Store<IState>,
    private router: Router,
    private actions$: Actions) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {

    const type: Type = route.data.type;
    const scope: Scope = route.data.scope;

    if (!type) {
      console.error('One of the data parameters was not provided for the route { routeParam, loadAction, successAction, failureAction, redirectTo }');
      return of(false);
    }
    const subject: ReplaySubject<boolean> = new ReplaySubject<boolean>();
    this.actions$.pipe(
      ofType(DocumentActionTypes.ToggleType),
      take(1),
      map((action: Action) => {
            subject.next(true);
      }),
    ).subscribe();
    this.store.dispatch(new ToggleType({type: type, scope: scope}));

    return subject.asObservable().pipe(
      map((result) => {
        if (result) {
          return true;
        } else {
        }
      }),
    );

  }

}
