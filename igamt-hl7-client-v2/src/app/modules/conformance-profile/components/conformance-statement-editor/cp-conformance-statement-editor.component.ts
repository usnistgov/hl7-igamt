import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ConformanceStatementEditorComponent } from 'src/app/modules/core/components/conformance-statement-editor/conformance-statement-editor.component';
import { selectedConformanceProfile, selectMessagesById } from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { Message } from '../../../core/models/message/message.class';
import { MessageService } from '../../../core/services/message.service';
import { Type } from '../../../shared/constants/type.enum';
import { IConformanceStatementList, ICPConformanceStatementList } from '../../../shared/models/cs-list.interface';
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
        id: EditorID.CP_CS,
        title: 'Conformance Statements',
        resourceType: Type.CONFORMANCEPROFILE,
      },
      (cpList: ICPConformanceStatementList) => {
        const DTCSMap = {};
        const SGCSMap = {};
        Object.keys(cpList.associatedSEGConformanceStatementMap).forEach((key) => {
          SGCSMap[key] = [
            ...(SGCSMap[key] ? SGCSMap[key] : []),
            ...cpList.associatedSEGConformanceStatementMap[key].conformanceStatements,
          ];
        });
        Object.keys(cpList.associatedDTConformanceStatementMap).forEach((key) => {
          DTCSMap[key] = [
            ...(DTCSMap[key] ? DTCSMap[key] : []),
            ...cpList.associatedDTConformanceStatementMap[key].conformanceStatements,
          ];
        });
        return {
          resourceConformanceStatement: cpList.conformanceStatements,
          complementConformanceStatements: {
            [Type.DATATYPE]: DTCSMap,
            [Type.SEGMENT]: SGCSMap,
          },
          availableConformanceStatements: cpList.availableConformanceStatements,
        };
      },
      selectedConformanceProfile);
  }

  saveChanges(id: string, igId: string, changes: Array<IChange<IConformanceStatement>>): Observable<Message<any>> {
    return this.cpService.saveChanges(id, igId, changes);
  }

  getById(id: string, igId: string): Observable<IConformanceStatementList> {
    return this.cpService.getConformanceStatements(id, igId);
  }

  elementSelector(): MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement> {
    return selectMessagesById;
  }

  ngOnInit() {
  }

}
