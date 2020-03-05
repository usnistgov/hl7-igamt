import { Injectable, Type as CoreType } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Store } from '@ngrx/store';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter, map, pluck, switchMap, take, tap } from 'rxjs/operators';
import { IgEditActionTypes, OpenEditor, OpenEditorFailure } from '../../../root-store/ig/ig-edit/ig-edit.actions';
import { selectRouteParams } from '../../../root-store/index';
import { TurnOffLoader, TurnOnLoader } from '../../../root-store/loader/loader.actions';
import { IEditorMetadata } from '../../shared/models/editor.enum';

@Injectable()
export class IgEditorActivateGuard implements CanActivate {
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
            ofType(IgEditActionTypes.OpenEditor, IgEditActionTypes.OpenEditorFailure),
            filter((action: OpenEditor | OpenEditorFailure) => action.payload.id === id),
            take(1),
            map((action) => {
              switch (action.type) {
                case IgEditActionTypes.OpenEditor:
                  subject.next(true);
                  break;
                case IgEditActionTypes.OpenEditorFailure:
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
