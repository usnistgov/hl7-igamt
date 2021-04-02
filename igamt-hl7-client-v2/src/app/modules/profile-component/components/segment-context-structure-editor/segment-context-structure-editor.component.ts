import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions } from '@ngrx/effects';
import { MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { Observable, of, ReplaySubject, Subscription } from 'rxjs';
import { selectLoadedSegmentById } from '../../../../root-store/dam-igamt/igamt.loaded-resources.selectors';
import * as fromIgamtDisplaySelectors from '../../../../root-store/dam-igamt/igamt.resource-display.selectors';
import { LoadSegment } from '../../../../root-store/segment-edit/segment-edit.actions';
import { MessageService } from '../../../dam-framework/services/message.service';
import { SegmentService } from '../../../segment/services/segment.service';
import { HL7v2TreeColumnType } from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../../../shared/constants/type.enum';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';
import { IProfileComponentContext } from '../../../shared/models/profile.component';
import { IResource } from '../../../shared/models/resource.interface';
import { IChange } from '../../../shared/models/save-change';
import { ISegment } from '../../../shared/models/segment.interface';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { ProfileComponentService } from '../../services/profile-component.service';
import { ProfileComponentStructureEditor } from '../profile-component-structure-editor/profile-component-structure-editor';
import { Hl7V2TreeService } from 'src/app/modules/shared/services/hl7-v2-tree.service';

@Component({
  selector: 'app-segment-context-structure-editor',
  templateUrl: './segment-context-structure-editor.component.html',
  styleUrls: ['./segment-context-structure-editor.component.css'],
})
export class SegmentContextStructureEditorComponent extends ProfileComponentStructureEditor<IProfileComponentContext> implements OnInit {

  type = Type;
  segment: ReplaySubject<ISegment>;
  changes: ReplaySubject<IStructureChanges>;
  columns: HL7v2TreeColumnType[];
  username: Observable<string>;
  workspace_s: Subscription;
  segment$: Observable<ISegment>;

  constructor(
    readonly repository: StoreResourceRepositoryService,
    private segmentService: SegmentService,
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
        HL7v2TreeColumnType.PATH,
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

  elementSelector(): MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement> {
    return fromIgamtDisplaySelectors.selectSegmentsById;
  }
  resourceSelector(): MemoizedSelectorWithProps<object, { id: string; }, IResource> {
    return selectLoadedSegmentById;
  }
  getResourceType(): Type {
    return Type.SEGMENT;
  }

}

export interface IStructureChanges {
  [index: string]: {
    [property: string]: IChange;
  };
}
