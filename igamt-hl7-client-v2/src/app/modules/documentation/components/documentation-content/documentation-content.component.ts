import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import {
  flatMap,
  map,
  take,
} from 'rxjs/operators';
import { concatMap, mergeMap } from 'rxjs/operators';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { selectIsAdmin } from '../../../../root-store/authentication/authentication.reducer';
import { ToggleEditMode } from '../../../../root-store/documentation/documentation.actions';
import { documentationEntityAdapter, selectDocumentationById, selectEditMode } from '../../../../root-store/documentation/documentation.reducer';
import { DamAbstractEditorComponent } from '../../../dam-framework/services/dam-editor.component';
import { EditorID } from '../../../shared/models/editor.enum';
import {
  IDocumentation,
  IDocumentationWorkspaceActive,
  IDocumentationWorkspaceCurrent,
} from '../../models/documentation.interface';
import { DocumentationService } from '../../service/documentation.service';

@Component({
  selector: 'app-documentation-content',
  templateUrl: './documentation-content.component.html',
  styleUrls: ['./documentation-content.component.css'],
})
export class DocumentationContentComponent extends DamAbstractEditorComponent {

  readonly active$: Observable<IDocumentationWorkspaceActive>;
  readonly current$: Observable<IDocumentationWorkspaceCurrent>;
  readonly viewOnly$: Observable<boolean>;
  readonly admin$: Observable<boolean>;

  constructor(
    actions$: Actions,
    private documentationService: DocumentationService,
    store: Store<any>) {
    super({ id: EditorID.SECTION_NARRATIVE }, actions$, store);
    this.viewOnly$ = combineLatest(this.store.select(selectIsAdmin), this.store.select(selectEditMode)).
      pipe(
        map(([admin, editMode]) => {
          return !admin || !editMode;
        }));
  }

  dataChange(form: FormGroup) {
    this.editorChange(form.getRawValue(), form.valid);
  }

  onEditorSave(action: fromDAM.EditorSave): Observable<Action> {
    return combineLatest(this.current$, this.payload$).pipe(
      take(1),
      mergeMap(([obj, documentations]) => {
        return this.documentationService.save(obj.data).pipe(
          flatMap((doc: IDocumentation) => {
            return [
              new fromDAM.LoadPayloadData(documentationEntityAdapter.updateOne({ id: doc.id, changes: { ...doc } }, documentations)),
              new ToggleEditMode(false)];
          },
          ),
        );
      }),
    );
  }

  editorDisplayNode(): Observable<IDocumentation> {
    return this.elementId$.pipe(
      concatMap((id) => {
        return this.store.select(selectDocumentationById, { id });
      }),
    );
  }

  onDeactivate() {
    return of(true);
  }

}
