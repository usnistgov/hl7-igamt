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
import { IConformanceStatementList, ICPConformanceStatementList } from '../../../shared/models/cs-list.interface';
import { IConformanceStatement } from '../../../shared/models/cs.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';
import { IChange } from '../../../shared/models/save-change';
import { ElementNamingService } from '../../../shared/services/element-naming.service';
import { PathService } from '../../../shared/services/path.service';
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
    dialog: MatDialog,
    pathService: PathService,
    elementNamingService: ElementNamingService,
    messageService: MessageService,
    actions$: Actions,
    store: Store<any>) {
    super(
      repository,
      messageService,
      dialog,
      pathService,
      elementNamingService,
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
          resourceConformanceStatement: cpList.conformanceStatements || [],
          complementConformanceStatements: {
            [Type.DATATYPE]: DTCSMap,
            [Type.SEGMENT]: SGCSMap,
          },
          availableConformanceStatements: cpList.availableConformanceStatements,
        };
      },
      fromIgamtSelectedSelectors.selectedConformanceProfile);
  }

  saveChanges(id: string, documentRef: IDocumentRef, changes: Array<IChange<IConformanceStatement>>): Observable<Message<any>> {
    return this.cpService.saveChanges(id, documentRef, changes);
  }

  getById(id: string, documentRef: IDocumentRef): Observable<IConformanceStatementList> {
    return this.cpService.getConformanceStatements(id, documentRef);
  }

  elementSelector(): MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement> {
    return fromIgamtDisplaySelectors.selectMessagesById;
  }

  ngOnInit() {
  }

}
