import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import { ConformanceStatementService } from 'src/app/modules/shared/services/conformance-statement.service';
import { StoreResourceRepositoryService } from 'src/app/modules/shared/services/resource-repository.service';
import { selectLoadedSegmentById } from '../../../../root-store/dam-igamt/igamt.loaded-resources.selectors';
import { Type } from '../../../shared/constants/type.enum';
import { EditorID } from '../../../shared/models/editor.enum';
import { ProfileComponentService } from '../../services/profile-component.service';
import { ConformanceStatementEditorComponent } from '../conformance-statement-editor/conformance-statement-editor.component';

@Component({
  selector: 'app-segment-conformance-statement-editor',
  templateUrl: '../conformance-statement-editor/conformance-statement-editor.component.html',
  styleUrls: ['../conformance-statement-editor/conformance-statement-editor.component.scss'],
})
export class SegmentConformanceStatementEditorComponent extends ConformanceStatementEditorComponent implements OnInit {

  constructor(
    readonly repository: StoreResourceRepositoryService,
    messageService: MessageService,
    protected conformanceStatementService: ConformanceStatementService,
    pcService: ProfileComponentService,
    dialog: MatDialog,
    actions$: Actions,
    store: Store<any>,
  ) {
    super(
      repository,
      messageService,
      conformanceStatementService,
      pcService,
      dialog,
      actions$,
      store,
      {
        id: EditorID.PC_SEGMENT_CTX_CS,
        title: 'Conformance Statements',
        resourceType: Type.SEGMENTCONTEXT,
      },
      selectLoadedSegmentById,
    );
  }

  ngOnInit() {
  }

}
