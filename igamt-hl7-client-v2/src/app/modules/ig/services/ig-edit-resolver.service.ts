import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import * as fromIgEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';

@Injectable({
  providedIn: 'root',
})
export class IgEditResolverService implements Resolve<any> {

  constructor(private store: Store<fromIgEdit.IState>) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const igId = route.params['id'];
    this.store.dispatch(new fromIgEdit.IgEditResolverLoad(igId));
    return this.store.select(fromIgEdit.selectIgDocument).pipe(
      filter((ig: IgDocument) => {
        return ig && ig.id && ig.id === igId;
      }),
      take(1),
    );
  }

}
