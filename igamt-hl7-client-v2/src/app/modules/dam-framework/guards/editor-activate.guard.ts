import { Injectable, Type as CoreType } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Store } from '@ngrx/store';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter, map, pluck, switchMap, take, tap } from 'rxjs/operators';
import { selectRouteParams } from '../../../root-store/index';
import { IEditorMetadata } from '../models/data/workspace';
import { DamActionTypes, OpenEditor, OpenEditorFailure } from '../store/data/dam.actions';
import { TurnOffLoader, TurnOnLoader } from '../store/loader/loader.actions';

@Injectable()
export class EditorActivateGuard implements CanActivate {
  constructor(
    private router: Router,
    private store: Store<any>,
    private actions$: Actions) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    // Start Loading
    this.store.dispatch(new TurnOnLoader({
      blockUI: true,
    }));

    // Get Necessary parameters from Route DATA
    const editorMetadata: IEditorMetadata = route.data['editorMetadata'];
    const elementId: string = route.data['idKey'];
    const EditorAction: CoreType<Action> = route.data['action'];

    console.log('EDITOR CAN ACTIVATE ' + editorMetadata.id);

    if (!editorMetadata || !elementId) {
      console.error('Editor route must have data attributes editorMetadata and idKey declared');
      return of(false);
    }

    // Get Action to dispatch for EditorID
    if (!EditorAction) {
      console.error('Editor route does not have a mapped action');
      return of(false);
    } else {

      return this.store.select(selectRouteParams).pipe(
        take(1),
        pluck(elementId),
        switchMap((id) => {
          const subject: ReplaySubject<boolean> = new ReplaySubject<boolean>();
          this.actions$.pipe(
            ofType(DamActionTypes.OpenEditor, DamActionTypes.OpenEditorFailure),
            filter((action: OpenEditor | OpenEditorFailure) => action.payload.id === id),
            take(1),
            map((action) => {
              switch (action.type) {
                case DamActionTypes.OpenEditor:
                  subject.next(true);
                  break;
                case DamActionTypes.OpenEditorFailure:
                  subject.next(false);
                  break;
              }
            }),
            tap(() => {
              this.store.dispatch(new TurnOffLoader());
            }),
          ).subscribe();

          this.store.dispatch(new EditorAction({
            id,
            editor: editorMetadata,
          }));

          return subject.asObservable().pipe(
            map((result) => {
              if (result) {
                return true;
              } else {
                return this.router.createUrlTree(['ig', 'error']);
              }
            }),
          );
        }),
      );
    }
  }
}
