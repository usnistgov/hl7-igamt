import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ConformanceStatementEditorComponent } from 'src/app/modules/core/components/conformance-statement-editor/conformance-statement-editor.component';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import * as fromIgamtSelectedSelectors from 'src/app/root-store/dam-igamt/igamt.selected-resource.selectors';
import { Message } from '../../../dam-framework/models/messages/message.class';
import { MessageService } from '../../../dam-framework/services/message.service';
import { Type } from '../../../shared/constants/type.enum';
import { IDocumentRef } from '../../../shared/models/abstract-domain.interface';
import { IConformanceStatementList } from '../../../shared/models/cs-list.interface';
import { IConformanceStatement } from '../../../shared/models/cs.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';
import { IChange } from '../../../shared/models/save-change';
import { ConformanceStatementService } from '../../../shared/services/conformance-statement.service';
import { Hl7V2TreeService } from '../../../shared/services/hl7-v2-tree.service';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { DatatypeService } from '../../services/datatype.service';

@Component({
  selector: 'app-conformance-statement-editor',
  templateUrl: '../../../core/components/conformance-statement-editor/conformance-statement-editor.component.html',
  styleUrls: ['../../../core/components/conformance-statement-editor/conformance-statement-editor.component.scss'],
})
export class DatatypeConformanceStatementEditorComponent extends ConformanceStatementEditorComponent implements OnInit {

  constructor(
    readonly repository: StoreResourceRepositoryService,
    private datatypeService: DatatypeService,
    csService: ConformanceStatementService,
    treeService: Hl7V2TreeService,
    dialog: MatDialog,
    messageService: MessageService,
    actions$: Actions,
    store: Store<any>) {
    super(
      repository,
      messageService,
      dialog,
      csService,
      treeService,
      actions$,
      store,
      {
        id: EditorID.DATATYPE_CS,
        title: 'Conformance Statements',
        resourceType: Type.DATATYPE,
      },
      (dtCsList: IConformanceStatementList) => {
        const DTCSMap = {};
        Object.keys(dtCsList.associatedConformanceStatementMap).forEach((key) => {
          DTCSMap[key] = [
            ...DTCSMap[key],
            ...dtCsList.associatedConformanceStatementMap[key].conformanceStatements,
          ];
        });
        return {
          resourceConformanceStatement: dtCsList.conformanceStatements || [],
          complementConformanceStatements: {
            [Type.DATATYPE]: DTCSMap,
          },
          availableConformanceStatements: [],
        };
      },
      fromIgamtSelectedSelectors.selectedDatatype);
  }

  saveChanges(id: string, documentRef: IDocumentRef, changes: Array<IChange<IConformanceStatement>>): Observable<Message<any>> {
    return this.datatypeService.saveChanges(id, documentRef, changes);
  }

  getById(id: string, documentRef: IDocumentRef): Observable<IConformanceStatementList> {
    return this.datatypeService.getConformanceStatements(id, documentRef);
  }

  elementSelector(): MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement> {
    return fromIgamtDisplaySelectors.selectDatatypesById;
  }

  ngOnInit() {
  }

}
