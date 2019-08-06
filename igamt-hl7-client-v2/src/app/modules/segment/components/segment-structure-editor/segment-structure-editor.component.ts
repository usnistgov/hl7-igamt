import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { ISegment } from 'src/app/modules/shared/models/segment.interface';
import { StoreResourceRepositoryService } from 'src/app/modules/shared/services/resource-repository.service';
import { selectSegmentsById } from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { LoadSegment } from '../../../../root-store/segment-edit/segment-edit.actions';
import { StructureEditorComponent } from '../../../core/components/structure-editor/structure-editor.component';
import { Message } from '../../../core/models/message/message.class';
import { MessageService } from '../../../core/services/message.service';
import { Type } from '../../../shared/constants/type.enum';
import { EditorID } from '../../../shared/models/editor.enum';
import { IChange } from '../../../shared/models/save-change';
import { SegmentService } from '../../services/segment.service';
import { HL7v2TreeColumnType } from './../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';

@Component({
  selector: 'app-segment-structure-editor',
  templateUrl: '../../../core/components/structure-editor/structure-editor.component.html',
  styleUrls: ['../../../core/components/structure-editor/structure-editor.component.scss'],
})
export class SegmentStructureEditorComponent extends StructureEditorComponent<ISegment> implements OnDestroy, OnInit {

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
    store: Store<any>) {
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
        HL7v2TreeColumnType.TEXT,
        HL7v2TreeColumnType.COMMENT,
      ]);
  }

  saveChanges(id: string, igId: string, changes: IChange[]): Observable<Message<any>> {
    return this.segmentService.saveChanges(id, igId, changes);
  }
  getById(id: string): Observable<ISegment> {
    return this.segmentService.getById(id);
  }
  elementSelector(): MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement> {
    return selectSegmentsById;
  }

}

export interface IStructureChanges {
  [index: string]: {
    [property: string]: IChange;
  };
}
