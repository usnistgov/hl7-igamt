import { Injectable, Type as CoreType } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Store } from '@ngrx/store';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter, map, pluck, switchMap, take, tap } from 'rxjs/operators';
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { selectRouteParams } from '../../../root-store/index';
import { IHL7EditorMetadata } from '../../shared/models/editor.enum';

@Injectable()
export class IgEditorActivateGuard implements CanActivate {
  constructor(
    private router: Router,
    private store: Store<any>,
    private actions$: Actions) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    // Start Loading
    this.store.dispatch(new fromDAM.TurnOnLoader({
      blockUI: true,
    }));

    // Get Necessary parameters from Route DATA
    const editorMetadata: IHL7EditorMetadata = route.data['editorMetadata'];
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
            ofType(fromDam.DamActionTypes.OpenEditor, fromDam.DamActionTypes.OpenEditorFailure),
            filter((action: fromDam.OpenEditor | fromDam.OpenEditorFailure) => action.payload.id === id),
            take(1),
            map((action) => {
              switch (action.type) {
                case fromDam.DamActionTypes.OpenEditor:
                  subject.next(true);
                  break;
                case fromDam.DamActionTypes.OpenEditorFailure:
                  subject.next(false);
                  break;
              }
            }),
            tap(() => {
              this.store.dispatch(new fromDAM.TurnOffLoader());
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
