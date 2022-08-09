import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectIsWorkspaceAdmin } from '../../../root-store/workspace/workspace-edit/workspace-edit.selectors';
import { IEditorMetadata } from '../../dam-framework';
import { DamAbstractEditorComponent } from '../../dam-framework/services/dam-editor.component';

export abstract class AbstractWorkspaceEditorComponent extends DamAbstractEditorComponent {
  public isAdmin$: Observable<boolean>;

  constructor(
    editor: IEditorMetadata,
    actions$: Actions,
    store: Store<any>) {
    super(editor, actions$, store);
    this.isAdmin$ = this.store.select(selectIsWorkspaceAdmin);
  }
}
