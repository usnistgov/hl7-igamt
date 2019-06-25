import { Component, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as fromIgEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { AbstractEditorComponent } from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import { MessageService } from '../../../core/services/message.service';
import { Type } from '../../../shared/constants/type.enum';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';
import { DatatypeService } from '../../services/datatype.service';

@Component({
  selector: 'app-metadata-edit',
  templateUrl: './metadata-edit.component.html',
  styleUrls: ['./metadata-edit.component.scss'],
})
export class MetadataEditComponent extends AbstractEditorComponent implements OnInit {
  constructor(
    store: Store<fromIgEdit.IState>,
    actions$: Actions,
    private igService: DatatypeService,
    private messageService: MessageService) {
    super(
      {
        id: EditorID.DATATYPE_METADATA,
        resourceType: Type.DATATYPE,
        title: 'Metadata',
      },
      actions$,
      store,
    );
  }

  onEditorSave(action: fromIgEdit.EditorSave): Observable<Action> {
    throw new Error('Method not implemented.');
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      switchMap((elementId) => {
        return this.store.select(fromIgEdit.selectDatatypesById, { id: elementId });
      }),
    );
  }

  ngOnInit() {
  }

}
