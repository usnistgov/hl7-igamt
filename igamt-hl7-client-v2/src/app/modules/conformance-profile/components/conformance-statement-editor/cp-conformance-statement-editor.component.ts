import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { flatMap, map, take } from 'rxjs/operators';
import { ConformanceStatementEditorComponent } from 'src/app/modules/core/components/conformance-statement-editor/conformance-statement-editor.component';
import { IVerificationIssue } from 'src/app/modules/shared/models/verification.interface';
import { BindingService } from 'src/app/modules/shared/services/binding.service';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import * as fromIgamtSelectedSelectors from 'src/app/root-store/dam-igamt/igamt.selected-resource.selectors';
import { IConformanceStatementEditorData } from '../../../core/components/conformance-statement-editor/conformance-statement-editor.component';
import { Message } from '../../../dam-framework/models/messages/message.class';
import { MessageService } from '../../../dam-framework/services/message.service';
import { Type } from '../../../shared/constants/type.enum';
import { IDocumentRef } from '../../../shared/models/abstract-domain.interface';
import { IConformanceStatement } from '../../../shared/models/cs.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';
import { IChange } from '../../../shared/models/save-change';
import { ConformanceStatementService } from '../../../shared/services/conformance-statement.service';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { ConformanceProfileService } from '../../services/conformance-profile.service';

@Component({
  selector: 'app-conformance-statement-editor',
  templateUrl: '../../../core/components/conformance-statement-editor/conformance-statement-editor.component.html',
  styleUrls: ['../../../core/components/conformance-statement-editor/conformance-statement-editor.component.scss'],
})
export class CPConformanceStatementEditorComponent extends ConformanceStatementEditorComponent implements OnInit {

  constructor(
    readonly repository: StoreResourceRepositoryService,
    private cpService: ConformanceProfileService,
    private bindingsService: BindingService,
    conformanceStatementService: ConformanceStatementService,
    dialog: MatDialog,
    messageService: MessageService,
    actions$: Actions,
    store: Store<any>) {
    super(
      repository,
      messageService,
      conformanceStatementService,
      dialog,
      actions$,
      store,
      {
        id: EditorID.CP_CS,
        title: 'Conformance Statements',
        resourceType: Type.CONFORMANCEPROFILE,
      },
      fromIgamtSelectedSelectors.selectedConformanceProfile);
  }

  saveChanges(id: string, documentRef: IDocumentRef, changes: Array<IChange<IConformanceStatement>>): Observable<Message<any>> {
    return this.cpService.saveChanges(id, documentRef, changes);
  }

  getById(id: string, documentRef: IDocumentRef): Observable<IConformanceStatementEditorData> {
    return this.cpService.getConformanceStatementEditorData(id, documentRef);
  }

  verify(id: string, documentInfo: IDocumentRef): Observable<IVerificationIssue[]> {
    return this.bindingsService.getVerifyResourceBindings(Type.CONFORMANCEPROFILE, id);
  }

  elementSelector(): MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement> {
    return fromIgamtDisplaySelectors.selectMessagesById;
  }

  ngOnInit() {
  }

}
