import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions } from '@ngrx/effects';
import { MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ConformanceStatementEditorComponent } from 'src/app/modules/core/components/conformance-statement-editor/conformance-statement-editor.component';
import { selectedSegment, selectSegmentsById } from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { Message } from '../../../core/models/message/message.class';
import { MessageService } from '../../../core/services/message.service';
import { Type } from '../../../shared/constants/type.enum';
import { IConformanceStatementList } from '../../../shared/models/cs-list.interface';
import { IConformanceStatement } from '../../../shared/models/cs.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';
import { IChange } from '../../../shared/models/save-change';
import { ConformanceStatementService } from '../../../shared/services/conformance-statement.service';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { SegmentService } from '../../services/segment.service';

@Component({
  selector: 'app-conformance-statement-editor',
  templateUrl: '../../../core/components/conformance-statement-editor/conformance-statement-editor.component.html',
  styleUrls: ['../../../core/components/conformance-statement-editor/conformance-statement-editor.component.scss'],
})
export class SegmentConformanceStatementEditorComponent extends ConformanceStatementEditorComponent implements OnInit {

  constructor(
    readonly repository: StoreResourceRepositoryService,
    private segmentService: SegmentService,
    csService: ConformanceStatementService,
    dialog: MatDialog,
    messageService: MessageService,
    actions$: Actions,
    store: Store<any>) {
    super(
      repository,
      messageService,
      dialog,
      csService,
      actions$,
      store,
      {
        id: EditorID.SEGMENT_CS,
        title: 'Conformance Statements',
        resourceType: Type.SEGMENT,
      },
      (segmentCsList: IConformanceStatementList) => {
        const DTCSMap = {};
        console.log(segmentCsList);
        Object.keys(segmentCsList.associatedConformanceStatementMap || []).forEach((key) => {
          DTCSMap[key] = [
            ...(DTCSMap[key] ? DTCSMap[key] : []),
            ...segmentCsList.associatedConformanceStatementMap[key].conformanceStatements,
          ];
        });
        return {
          resourceConformanceStatement: segmentCsList.conformanceStatements,
          complementConformanceStatements: {
            [Type.DATATYPE]: DTCSMap,
          },
          availableConformanceStatements: segmentCsList.availableConformanceStatements,
        };
      },
      selectedSegment);
  }

  saveChanges(id: string, igId: string, changes: Array<IChange<IConformanceStatement>>): Observable<Message<any>> {
    return this.segmentService.saveChanges(id, igId, changes);
  }

  getById(id: string, igId: string): Observable<IConformanceStatementList> {
    return this.segmentService.getSegmentConformanceStatements(id, igId);
  }

  elementSelector(): MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement> {
    return selectSegmentsById;
  }

  ngOnInit() {
  }

}
