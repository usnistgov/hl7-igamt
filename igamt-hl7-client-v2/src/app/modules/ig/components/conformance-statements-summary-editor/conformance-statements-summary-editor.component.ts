import { Component, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IConformanceStatement } from 'src/app/modules/shared/models/cs.interface';
import { EditorSave } from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import { AbstractEditorComponent } from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import { Type } from '../../../shared/constants/type.enum';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
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

  onEditorSave(action: EditorSave): Observable<Action> {
    throw new Error('Method not implemented.');
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.ig$.pipe(
      map((ig) => {
        return this.igService.igToIDisplayElement(ig);
      }),
    );
  }

  onDeactivate(): void {
  }

  ngOnInit() {
  }

}
