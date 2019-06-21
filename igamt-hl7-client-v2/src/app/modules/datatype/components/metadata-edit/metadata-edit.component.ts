import { Component, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { concatMap, switchMap, take } from 'rxjs/operators';
import * as fromIgEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { selectIgId } from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { ResourceMetadataEditorComponent } from '../../../core/components/resource-metadata-editor/resource-metadata-editor.component';
import { Message } from '../../../core/models/message/message.class';
import { MessageService } from '../../../core/services/message.service';
import { Type } from '../../../shared/constants/type.enum';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';
import { IChange } from '../../../shared/models/save-change';
import { DatatypeService } from '../../services/datatype.service';

@Component({
  selector: 'app-metadata-edit',
  templateUrl: '../../../core/components/resource-metadata-editor/resource-metadata-editor.component.html',
  styleUrls: ['../../../core/components/resource-metadata-editor/resource-metadata-editor.component.scss'],
})
export class MetadataEditComponent extends ResourceMetadataEditorComponent implements OnInit {

  constructor(
    store: Store<fromIgEdit.IState>,
    actions$: Actions,
    private datatypeService: DatatypeService,
    messageService: MessageService) {
    super(
      {
        id: EditorID.DATATYPE_METADATA,
        resourceType: Type.DATATYPE,
        title: 'Metadata',
      },
      actions$,
      messageService,
      store,
    );
  }

  save(changes: IChange[]): Observable<Message<any>> {
    return combineLatest(this.elementId$, this.store.select(selectIgId)).pipe(
      take(1),
      concatMap(([id, documentId]) => {
        return this.datatypeService.saveChanges(id, documentId, changes);
      }),
    );
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
