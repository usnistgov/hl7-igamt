import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Actions} from '@ngrx/effects';
import {MemoizedSelectorWithProps, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {LoadConformanceProfile} from '../../../../root-store/conformance-profile-edit/conformance-profile-edit.actions';
import {
  selectLoadedMessageById,
} from '../../../../root-store/dam-igamt/igamt.loaded-resources.selectors';
import * as fromIgamtDisplaySelectors from '../../../../root-store/dam-igamt/igamt.resource-display.selectors';
import {ConformanceProfileService} from '../../../conformance-profile/services/conformance-profile.service';
import {Message} from '../../../dam-framework/models/messages/message.class';
import {MessageService} from '../../../dam-framework/services/message.service';
import {HL7v2TreeColumnType} from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import {Type} from '../../../shared/constants/type.enum';
import {IDocumentRef} from '../../../shared/models/abstract-domain.interface';
import {IConformanceProfile} from '../../../shared/models/conformance-profile.interface';
import {IDisplayElement} from '../../../shared/models/display-element.interface';
import {EditorID} from '../../../shared/models/editor.enum';
import {IProfileComponentContext} from '../../../shared/models/profile.component';
import {IResource} from '../../../shared/models/resource.interface';
import {IChange} from '../../../shared/models/save-change';
import {StoreResourceRepositoryService} from '../../../shared/services/resource-repository.service';
import {PcTreeService} from '../../services/pc-tree.service';
import {ProfileComponentService} from '../../services/profile-component.service';
import {ProfileComponentStructureEditor} from '../profile-component-structure-editor/profile-component-structure-editor';

@Component({
  selector: 'app-message-context-structure-editor',
  templateUrl: './message-context-structure-editor.component.html',
  styleUrls: ['./message-context-structure-editor.component.css'],
})
export class MessageContextStructureEditorComponent extends ProfileComponentStructureEditor<IProfileComponentContext> implements OnDestroy, OnInit {

  constructor(
    readonly repository: StoreResourceRepositoryService,
    private conformanceProfileService: ConformanceProfileService,
    messageService: MessageService,
    actions$: Actions,
    store: Store<any>, public treeService: PcTreeService, public pcService: ProfileComponentService,  public dialog: MatDialog,
  ) {
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
            resource: Type.CONFORMANCEPROFILE,
          },
          label: 'Conformance Profile',
        },
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
      ], treeService, pcService, dialog);
  }
  saveChanges(id: string, documentRef: IDocumentRef, changes: IChange[]): Observable<Message<any>> {
    return this.conformanceProfileService.saveChanges(id, documentRef, changes);
  }

  getById(id: string): Observable<IConformanceProfile> {
    return this.conformanceProfileService.getById(id);
  }

  elementSelector(): MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement> {
    return fromIgamtDisplaySelectors.selectMessagesById;
  }
  resourceSelector(): MemoizedSelectorWithProps<object, { id: string; }, IResource> {
    return selectLoadedMessageById;
  }
  getResourceType(): Type {
    return Type.CONFORMANCEPROFILE;
  }
}
