import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ConformanceStatementEditorComponent } from 'src/app/modules/core/components/conformance-statement-editor/conformance-statement-editor.component';
import { selectDatatypesById, selectedDatatype } from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
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
        id: EditorID.DATATYPE_CS,
        title: 'Conformance Statements',
        resourceType: Type.DATATYPE,
      },
      (dtCsList: IConformanceStatementList) => {
        const DTCSMap = {};
        console.log(dtCsList);
        Object.keys(dtCsList.associatedConformanceStatementMap).forEach((key) => {
          DTCSMap[key] = [
            ...DTCSMap[key],
            ...dtCsList.associatedConformanceStatementMap[key].conformanceStatements,
          ];
        });
        return {
          resourceConformanceStatement: dtCsList.conformanceStatements,
          complementConformanceStatements: {
            [Type.DATATYPE]: DTCSMap,
          },
          availableConformanceStatements: [],
        };
      },
      selectedDatatype);
  }

  saveChanges(id: string, igId: string, changes: Array<IChange<IConformanceStatement>>): Observable<Message<any>> {
    return this.datatypeService.saveChanges(id, igId, changes);
  }

  getById(id: string, igId: string): Observable<IConformanceStatementList> {
    return this.datatypeService.getSegmentConformanceStatements(id, igId);
  }

  elementSelector(): MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement> {
    return selectDatatypesById;
  }

  ngOnInit() {
  }

}
