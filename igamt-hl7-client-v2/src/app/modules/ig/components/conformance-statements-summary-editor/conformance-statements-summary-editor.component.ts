import { Component, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { IConformanceStatement } from 'src/app/modules/shared/models/cs.interface';
import { AbstractEditorComponent } from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import { Type } from '../../../shared/constants/type.enum';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { IgDocument } from '../../models/ig/ig-document.class';
import { IgService } from '../../services/ig.service';

@Component({
  selector: 'app-conformance-statements-summary-editor',
  templateUrl: './conformance-statements-summary-editor.component.html',
  styleUrls: ['./conformance-statements-summary-editor.component.scss'],
})
export class ConformanceStatementsSummaryEditorComponent extends AbstractEditorComponent implements OnInit {

  csList$: Observable<IConformanceStatement>;

  constructor(
    store: Store<any>,
    actions$: Actions,
    private igService: IgService,
    public repository: StoreResourceRepositoryService) {
    super(
      {
        id: EditorID.CS_SUMMARY,
        title: 'Conformance Statements Summary',
        resourceType: Type.CONFORMANCESTATEMENTSUMMARY,
      },
      actions$,
      store,
    );
    this.csList$ = this.currentSynchronized$.pipe(
      map((value) => {
        return value.summary;
      }),
    );
  }

  onEditorSave(action: fromDAM.EditorSave): Observable<Action> {
    throw new Error('Method not implemented.');
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.document$.pipe(
      map((document) => {
        return this.igService.igToIDisplayElement(document as IgDocument);
      }),
    );
  }

  onDeactivate(): void {
  }

  ngOnInit() {
  }

}
