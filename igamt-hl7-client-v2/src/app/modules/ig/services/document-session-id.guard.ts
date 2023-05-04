import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { SetValue } from '../../dam-framework/store/data/dam.actions';
import { selectDocumentSessionId } from './../../../root-store/ig/ig-edit/ig-edit.selectors';

export interface IDocumentSessionId {
  uid: string;
  documentId: string;
}

@Injectable({
  providedIn: 'root',
})
export class DocumentSessionIdGuard implements CanActivate {
  constructor(
    private store: Store<any>) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const uid = this.generateSessionId(10);
    const routeParam: string = route.data.routeParam;
    const documentId = routeParam ? route.params[routeParam] : '';

    this.store.dispatch(new SetValue({
      documentSessionId: {
        uid,
        documentId,
      },
    }));

    return this.store.select(selectDocumentSessionId).pipe(
      filter((session) => {
        return session && session.uid === uid && session.documentId === documentId;
      }),
      take(1),
      map(() => {
        return true;
      }),
    );

  }

  generateSessionId(n: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < n; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
