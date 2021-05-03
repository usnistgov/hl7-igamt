import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectDelta } from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { map, take } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { selectSelectedResource } from 'src/app/root-store/dam-igamt/igamt.selected-resource.selectors';

@Injectable({ providedIn: 'root' })
export class DeltaRouteGuard implements CanActivate {

  constructor(private store: Store<any>, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UrlTree | boolean> {
    const deltaRoute = route.data && route.data.routes && route.data.routes.delta ? route.data.routes.delta : 'delta';
    const redirectTo = route.data && route.data.routes && route.data.routes.default ? route.data.routes.default : 'structure';

    return combineLatest(
      this.store.select(selectDelta),
      this.store.select(selectSelectedResource)
    ).pipe(
      take(1),
      map(([delta, resource]) => {
        if (!resource) {
          return false;
        }

        if (delta && resource.origin) {
          return this.router.parseUrl(state.url + '/' + deltaRoute);
        } else {
          return this.router.parseUrl(state.url + '/' + redirectTo);
        }
      })
    );
  }
}
