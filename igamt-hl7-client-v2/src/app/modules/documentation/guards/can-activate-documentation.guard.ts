import {Injectable, Type as CoreType} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Actions, ofType} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {Observable, of, ReplaySubject} from 'rxjs';
import {filter, map, pluck, switchMap, take, tap} from 'rxjs/operators';
import {selectRouteParams} from '../../../root-store';
import {
  DocumentationActionTypes, OpenDocumentationEditor, OpenDocumentationSectionFailure,
} from '../../../root-store/documentation/documentation.actions';
import {TurnOffLoader, TurnOnLoader} from '../../../root-store/loader/loader.actions';
import {IEditorMetadata} from '../../shared/models/editor.enum';

@Injectable({
  providedIn: 'root',
})
export class CanActivateDocumentationGuard implements CanActivate {
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
            tap((x) => {
              console.log(id);
            }),
            ofType(DocumentationActionTypes.OpenDocumentationEditor, DocumentationActionTypes.OpenDocumentationSectionFailure),
            filter((action: OpenDocumentationEditor | OpenDocumentationSectionFailure) => action.payload.id === id),
            tap((x) => {
              console.log(x);
            }),
            take(1),
            map((action) => {
              switch (action.type) {
                case DocumentationActionTypes.OpenDocumentationEditor:
                  subject.next(true);
                  break;
                case DocumentationActionTypes.OpenDocumentationSectionFailure:
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
                return this.router.createUrlTree(['documentation', 'error']);
              }
            }),
          );
        }),
      );
    }
  }
}
