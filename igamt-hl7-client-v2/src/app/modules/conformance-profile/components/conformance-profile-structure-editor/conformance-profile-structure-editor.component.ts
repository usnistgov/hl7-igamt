import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LoadConformanceProfile } from '../../../../root-store/conformance-profile-edit/conformance-profile-edit.actions';
import { selectMessagesById } from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { StructureEditorComponent } from '../../../core/components/structure-editor/structure-editor.component';
import { Message } from '../../../core/models/message/message.class';
import { MessageService } from '../../../core/services/message.service';
import { HL7v2TreeColumnType } from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../../../shared/constants/type.enum';
import { IConformanceProfile } from '../../../shared/models/conformance-profile.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';
import { IChange } from '../../../shared/models/save-change';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { ConformanceProfileService } from '../../services/conformance-profile.service';

@Component({
  selector: 'app-conformance-profile-structure-editor',
  templateUrl: '../../../core/components/structure-editor/structure-editor.component.html',
  styleUrls: ['../../../core/components/structure-editor/structure-editor.component.scss'],
})
export class ConformanceProfileStructureEditorComponent extends StructureEditorComponent<IConformanceProfile> implements OnDestroy, OnInit {

  constructor(
    readonly repository: StoreResourceRepositoryService,
    private conformanceProfileService: ConformanceProfileService,
    messageService: MessageService,
    actions$: Actions,
    store: Store<any>) {
    super(
      repository,
      messageService,
      actions$,
      store,
      {
        id: EditorID.CONFP_STRUCTURE,
        title: 'Structure',
        resourceType: Type.CONFORMANCEPROFILE,
      },
      LoadConformanceProfile,
      [
        {
          context: {
            resource: Type.SEGMENT,
          },
          label: 'Segment',
        },
        {
          context: {
            resource: Type.DATATYPE,
            element: Type.FIELD,
          },
          label: 'Datatype (FIELD)',
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
        HL7v2TreeColumnType.SEGMENT,
        HL7v2TreeColumnType.USAGE,
        HL7v2TreeColumnType.VALUESET,
        HL7v2TreeColumnType.CONSTANTVALUE,
        HL7v2TreeColumnType.CARDINALITY,
        HL7v2TreeColumnType.LENGTH,
        HL7v2TreeColumnType.CONFLENGTH,
        HL7v2TreeColumnType.TEXT,
        HL7v2TreeColumnType.COMMENT,
      ]);
  }

  saveChanges(id: string, igId: string, changes: IChange[]): Observable<Message<any>> {
    return this.conformanceProfileService.saveChanges(id, igId, changes);
  }
  getById(id: string): Observable<IConformanceProfile> {
    return this.conformanceProfileService.getById(id);
  }
  elementSelector(): MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement> {
    return selectMessagesById;
  }

}
