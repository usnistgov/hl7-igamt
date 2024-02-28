import { Component, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IEditorMetadata } from 'src/app/modules/dam-framework';
import { DamAbstractEditorComponent } from 'src/app/modules/dam-framework/services/dam-editor.component';
import { EditorSave } from 'src/app/modules/dam-framework/store';

@Component({
  selector: 'app-code-set-version-editor',
  templateUrl: './code-set-version-editor.component.html',
  styleUrls: ['./code-set-version-editor.component.css']
})
export class CodeSetVersionEditorComponent extends DamAbstractEditorComponent {


  onEditorSave(action: EditorSave): Observable<Action> {
    throw new Error('Method not implemented.');
  }
  editorDisplayNode(): Observable<any> {
    throw new Error('Method not implemented.');
  }
  onDeactivate(): void {
    throw new Error('Method not implemented.');
  }

 // public isAdmin$: Observable<boolean>;

  constructor(
    editor: IEditorMetadata,
    actions$: Actions,
    store: Store<any>) {
    super(editor, actions$, store);
    //this.isAdmin$ = this.store.select(selectIsWorkspaceAdmin);
  }
}
