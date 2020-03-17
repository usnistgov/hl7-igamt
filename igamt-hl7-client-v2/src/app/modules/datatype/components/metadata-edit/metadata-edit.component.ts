import { Component, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { concatMap, switchMap, take } from 'rxjs/operators';
import * as fromIgEdit from 'src/app/root-store/document/document-edit/ig-edit.index';
import {selectAllDatatypes} from 'src/app/root-store/document/document-edit/ig-edit.index';
import { LoadDatatype } from '../../../../root-store/datatype-edit/datatype-edit.actions';
import { selectIgId } from '../../../../root-store/document/document-edit/ig-edit.selectors';
import { ResourceMetadataEditorComponent } from '../../../core/components/resource-metadata-editor/resource-metadata-editor.component';
import { Message } from '../../../core/models/message/message.class';
import { MessageService } from '../../../core/services/message.service';
import { Type } from '../../../shared/constants/type.enum';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';
import { IChange } from '../../../shared/models/save-change';
import { FroalaService } from '../../../shared/services/froala.service';
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
    messageService: MessageService, froalaService: FroalaService) {
    super(
      {
        id: EditorID.DATATYPE_METADATA,
        resourceType: Type.DATATYPE,
        title: 'Metadata',
      },
      actions$,
      messageService,
      store,
      froalaService,
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

  reloadResource(resourceId: string): Action {
    return new LoadDatatype(resourceId);
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      switchMap((elementId) => {
        return this.store.select(fromIgEdit.selectDatatypesById, { id: elementId });
      }),
    );
  }

  getExistingList(): Observable<IDisplayElement[]> {
    return this.store.select(selectAllDatatypes);
  }

  ngOnInit() {
  }

}
