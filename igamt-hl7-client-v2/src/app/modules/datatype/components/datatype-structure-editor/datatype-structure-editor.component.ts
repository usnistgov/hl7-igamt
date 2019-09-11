import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LoadDatatype } from '../../../../root-store/datatype-edit/datatype-edit.actions';
import { selectDatatypesById } from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { StructureEditorComponent } from '../../../core/components/structure-editor/structure-editor.component';
import { Message } from '../../../core/models/message/message.class';
import { MessageService } from '../../../core/services/message.service';
import { HL7v2TreeColumnType } from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../../../shared/constants/type.enum';
import { IDatatype } from '../../../shared/models/datatype.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';
import { IChange } from '../../../shared/models/save-change';
import { DeltaService } from '../../../shared/services/delta.service';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { DatatypeService } from '../../services/datatype.service';

@Component({
  selector: 'app-datatype-structure-editor',
  templateUrl: '../../../core/components/structure-editor/structure-editor.component.html',
  styleUrls: ['../../../core/components/structure-editor/structure-editor.component.scss'],
})
export class DatatypeStructureEditorComponent extends StructureEditorComponent<IDatatype> implements OnDestroy, OnInit {

  constructor(
    readonly repository: StoreResourceRepositoryService,
    private datatypeService: DatatypeService,
    messageService: MessageService,
    actions$: Actions,
    store: Store<any>) {
    super(
      repository,
      messageService,
      actions$,
      store,
      {
        id: EditorID.DATATYPE_STRUCTURE,
        title: 'Structure',
        resourceType: Type.DATATYPE,
      },
      LoadDatatype,
      [
        {
          context: {
            resource: Type.DATATYPE,
          },
          label: 'Datatype',
        },
        {
          context: {
            resource: Type.DATATYPE,
            element: Type.COMPONENT,
          },
          label: 'Datatype (COMPONENT)',
        },
      ],
      [
        HL7v2TreeColumnType.NAME,
        HL7v2TreeColumnType.DATATYPE,
        HL7v2TreeColumnType.USAGE,
        HL7v2TreeColumnType.VALUESET,
        HL7v2TreeColumnType.CONSTANTVALUE,
        HL7v2TreeColumnType.LENGTH,
        HL7v2TreeColumnType.CONFLENGTH,
        HL7v2TreeColumnType.TEXT,
        HL7v2TreeColumnType.COMMENT,
      ]);
  }

  saveChanges(id: string, igId: string, changes: IChange[]): Observable<Message<any>> {
    return this.datatypeService.saveChanges(id, igId, changes);
  }
  getById(id: string): Observable<IDatatype> {
    return this.datatypeService.getById(id);
  }
  elementSelector(): MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement> {
    return selectDatatypesById;
  }

}
