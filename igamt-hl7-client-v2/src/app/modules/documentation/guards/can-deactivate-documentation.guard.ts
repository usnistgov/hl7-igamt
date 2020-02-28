import { Injectable } from '@angular/core';
import {MatDialog} from '@angular/material';
import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Actions, ofType} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {combineLatest, Observable, of} from 'rxjs';
import {concatMap, map, take, tap} from 'rxjs/operators';
import {
  DocumentationActionTypes, DocumentationToolBarSave,
} from '../../../root-store/documentation/documentation.actions';
import {
  selectWorkspaceCurrentIsChanged,
  selectWorkspaceCurrentIsValid,
} from '../../../root-store/documentation/documentation.reducer';
import {ConfirmDialogComponent} from '../../shared/components/confirm-dialog/confirm-dialog.component';
import {DocumentationContentComponent} from '../components/documentation-content/documentation-content.component';

@Injectable({
  providedIn: 'root',
})
export class CanDeactivateDocumentationGuard implements CanDeactivate<DocumentationContentComponent> {
  constructor(
    private store: Store<any>,
    private actions$: Actions,
    private dialog: MatDialog,
  ) { }
  canDeactivate(component: DocumentationContentComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): Observable<boolean>  {

    return combineLatest(
      this.store.select(selectWorkspaceCurrentIsChanged),
      this.store.select(selectWorkspaceCurrentIsValid),
    ).pipe(
      take(1),
      concatMap(([editorChanged, editorValid]) => {
        if (!editorValid) {
          // TOGGLE INVALID DIALOG
          const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
              question: 'You have invalid data in your form, leaving will result in unsaved work. Do you want to leave ?',
              action: 'Invalid Data',
            },
          });

          return dialogRef.afterClosed().pipe(
            map((answer: boolean) => answer),
          );
        } else {
          if (editorChanged) {
            this.store.dispatch(new DocumentationToolBarSave());
            return this.actions$.pipe(
              ofType(DocumentationActionTypes.UpdateDocumentationState, DocumentationActionTypes.DocumentationEditorSaveFailure),
              map((action: Action) => {
                switch (action.type) {
                  case DocumentationActionTypes.UpdateDocumentationState:
                    component.onDeactivate();
                    return true;
                  case DocumentationActionTypes.DocumentationEditorSaveFailure: return false;
                }
              }),
            );
          } else {
            return of(true).pipe(
              tap(() => component.onDeactivate()),
            );
          }
        }
      }),
    );

  }
}
