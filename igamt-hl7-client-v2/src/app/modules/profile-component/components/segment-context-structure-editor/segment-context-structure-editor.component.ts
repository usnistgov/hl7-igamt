import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions } from '@ngrx/effects';
import { MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Hl7V2TreeService } from 'src/app/modules/shared/services/hl7-v2-tree.service';
import { selectLoadedSegmentById } from '../../../../root-store/dam-igamt/igamt.loaded-resources.selectors';
import { LoadSegment } from '../../../../root-store/segment-edit/segment-edit.actions';
import { MessageService } from '../../../dam-framework/services/message.service';
import { HL7v2TreeColumnType } from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../../../shared/constants/type.enum';
import { EditorID } from '../../../shared/models/editor.enum';
import { IProfileComponentContext } from '../../../shared/models/profile.component';
import { IResource } from '../../../shared/models/resource.interface';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { ProfileComponentService } from '../../services/profile-component.service';
import { ProfileComponentContextStructureEditor } from '../profile-component-context-structure-editor/profile-component-context-structure-editor.component';

@Component({
  selector: 'app-segment-context-structure-editor',
  templateUrl: '../profile-component-context-structure-editor/profile-component-context-structure-editor.component.html',
  styleUrls: ['../profile-component-context-structure-editor/profile-component-context-structure-editor.component.css'],
})
export class SegmentContextStructureEditorComponent extends ProfileComponentContextStructureEditor<IProfileComponentContext> implements OnInit {

  constructor(
    readonly repository: StoreResourceRepositoryService,
    messageService: MessageService,
    actions$: Actions,
    store: Store<any>, public treeService: Hl7V2TreeService, public pcService: ProfileComponentService, public dialog: MatDialog,
  ) {
    super(
      repository,
      messageService,
      actions$,
      store,
      {
        id: EditorID.SEGMENT_STRUCTURE,
        title: 'Structure',
        resourceType: Type.SEGMENT,
      },
      LoadSegment,
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
        HL7v2TreeColumnType.USAGE,
        HL7v2TreeColumnType.VALUESET,
        HL7v2TreeColumnType.CONSTANTVALUE,
        HL7v2TreeColumnType.CARDINALITY,
        HL7v2TreeColumnType.LENGTH,
        HL7v2TreeColumnType.CONFLENGTH,
      ],
      treeService, pcService, dialog);
  }

  resourceSelector(): MemoizedSelectorWithProps<object, { id: string; }, IResource> {
    return selectLoadedSegmentById;
  }
}
