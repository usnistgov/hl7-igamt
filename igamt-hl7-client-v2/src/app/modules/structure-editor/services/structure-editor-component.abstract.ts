import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { AbstractEditorComponent } from '../../core/components/abstract-editor-component/abstract-editor-component.component';
import { Status } from '../../shared/models/abstract-domain.interface';
import { IHL7EditorMetadata } from '../../shared/models/editor.enum';

export abstract class StructureEditorComponent extends AbstractEditorComponent {

  constructor(
    editor: IHL7EditorMetadata,
    actions$: Actions,
    store: Store<any>) {
    super(editor, actions$, store);
    this._viewOnly$ = this.editorDisplayNode().pipe(
      map((resource) => {
        return resource.status === Status.PUBLISHED;
      }),
    );
  }

}
