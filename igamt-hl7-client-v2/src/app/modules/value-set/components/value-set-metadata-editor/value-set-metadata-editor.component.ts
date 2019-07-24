import { Component, OnInit } from '@angular/core';
import {Actions} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {combineLatest, Observable} from 'rxjs';
import {concatMap, switchMap, take, tap} from 'rxjs/operators';
import * as fromIgEdit from '../../../../root-store/ig/ig-edit/ig-edit.index';
import {selectIgId} from '../../../../root-store/ig/ig-edit/ig-edit.index';
import {ResourceMetadataEditorComponent} from '../../../core/components/resource-metadata-editor/resource-metadata-editor.component';
import {Message} from '../../../core/models/message/message.class';
import {MessageService} from '../../../core/services/message.service';
import {FieldType} from '../../../shared/components/metadata-form/metadata-form.component';
import {Type} from '../../../shared/constants/type.enum';
import {IDisplayElement} from '../../../shared/models/display-element.interface';
import {EditorID} from '../../../shared/models/editor.enum';
import {IChange} from '../../../shared/models/save-change';
import {ValueSetService} from '../../service/value-set.service';

@Component({
  selector: 'app-metadata-edit',
  templateUrl: '../../../core/components/resource-metadata-editor/resource-metadata-editor.component.html',
  styleUrls: ['../../../core/components/resource-metadata-editor/resource-metadata-editor.component.scss'],
})
export class ValueSetMetadataEditorComponent extends ResourceMetadataEditorComponent implements OnInit {

  constructor(
    store: Store<fromIgEdit.IState>,
    actions$: Actions,
    private valueSetService: ValueSetService,
    messageService: MessageService) {
    super(
      {
        id: EditorID.VALUESET_METADATA,
        resourceType: Type.VALUESET,
        title: 'Metadata',
      },
      actions$,
      messageService,
      store,
    );
    const authorNotes = 'Author notes';
    const usageNotes = 'Usage notes';
    this.metadataFormInput = {
      viewOnly: this.viewOnly$,
      data: this.currentSynchronized$,
      model: {
        bindingIdentifier: {
          label: 'Binding identifier',
          placeholder: 'Binding Identifier',
          validators: [],
          type: FieldType.TEXT,
          id: 'bindingIdentifier',
          disabled: false,
          name: 'bindingIdentifier',
        },
        name: {
          label: 'Name',
          placeholder: 'Name',
          validators: [],
          type: FieldType.TEXT,
          id: 'name',
          name: 'Name',
        },
        authorNotes: {
          label: authorNotes,
          placeholder: authorNotes,
          validators: [],
          enum: [],
          type: FieldType.RICH,
          id: 'authornotes',
          name: authorNotes,
        },
        usageNotes: {
          label: usageNotes,
          placeholder: usageNotes,
          validators: [],
          enum: [],
          type: FieldType.RICH,
          id: 'usagenotes',
          name: usageNotes,
        },
      },
    };

  }

  save(changes: IChange[]): Observable<Message<any>> {
    return combineLatest(this.elementId$, this.store.select(selectIgId)).pipe(
      take(1),
      concatMap(([id, documentId]) => {
        return this.valueSetService.saveChanges(id, documentId, changes);
      }),
    );
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      switchMap((elementId) => {
        return this.store.select(fromIgEdit.selectValueSetById, { id: elementId });
      }),
    );
  }

  ngOnInit() {
  }

}
