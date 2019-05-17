import { Inject, Type as CoreType } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, map, pluck, switchMap, take, tap } from 'rxjs/operators';
import { selectWorkspaceActive } from '../../../root-store/ig/ig-edit/ig-edit.selectors';
import { selectRouteParams } from '../../../root-store/index';
import { TurnOffLoader, TurnOnLoader } from '../../../root-store/loader/loader.actions';
import { IEditorMetadata } from '../../shared/models/editor.enum';
import { EditorActionMapToken } from '../ig.token';
import { EditorActionMap } from '../models/editor/editor-action-map.interface';

export class IgEditorActivateGuard implements CanActivate {

  constructor(private store: Store<any>, @Inject(EditorActionMapToken) private editorActionMap: EditorActionMap) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    // Start Loading
    this.store.dispatch(new TurnOnLoader({
      blockUI: true,
    }));

    // Get Necessary parameters from Route DATA
    const editorMetadata: IEditorMetadata = route.data['editorMetadata'];
    const elementId: string = route.data['idKey'];

    if (!editorMetadata || !elementId) {
      console.error('Editor route must have data attributes editorMetadata and idKey declared');
      return of(false);
    }

    // Get Action to dispatch for EditorID
    const EditorAction: CoreType<Action> = this.editorActionMap[editorMetadata.id];

    if (!EditorAction) {
      console.error('Editor route does not have a mapped action');
      return of(false);
    } else {

      return this.store.select(selectRouteParams).pipe(
        take(1),
        pluck(elementId),
        switchMap((id) => {
          this.store.dispatch(new EditorAction({
            id,
            editor: editorMetadata,
          }));
          return this.store.select(selectWorkspaceActive).pipe(
            tap((a) => console.log(a)),
            filter((active) => active && active.display && active.display.id === id),
            take(1),
            tap(() => {
              this.store.dispatch(new TurnOffLoader());
            }),
            map((active) => true),
          );
        }),
      );
    }
  }
}
