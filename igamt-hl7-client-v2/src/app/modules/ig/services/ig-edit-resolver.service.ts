import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import * as fromIgEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { IgDocument } from '../models/ig/ig-document.class';

@Injectable({
  providedIn: 'root',
})
export class IgEditResolverService implements CanActivate {

  constructor(private store: Store<fromIgEdit.IState>) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const igId = route.params['igId'];
    this.store.dispatch(new fromIgEdit.IgEditResolverLoad(igId));
    return this.store.select(fromIgEdit.selectIgDocument).pipe(
      filter((ig: IgDocument) => {
        return ig && ig.id && ig.id === igId;
      }),
      map(() => true),
      take(1),
    );
  }

}
