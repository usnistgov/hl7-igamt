import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { Action, MemoizedSelector, MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { IResource } from 'src/app/modules/shared/models/resource.interface';
import { EditorSave } from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import { CsDialogComponent } from '../../../shared/components/cs-dialog/cs-dialog.component';
import { Type } from '../../../shared/constants/type.enum';
import { IConformanceStatementList, ICPConformanceStatementList } from '../../../shared/models/cs-list.interface';
import { IConformanceStatement } from '../../../shared/models/cs.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IEditorMetadata } from '../../../shared/models/editor.enum';
import { ConformanceStatementService } from '../../../shared/services/conformance-statement.service';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { MessageService } from '../../services/message.service';
import { AbstractEditorComponent } from '../abstract-editor-component/abstract-editor-component.component';

export type ConformanceStatementPluck = (cs: IConformanceStatementList | ICPConformanceStatementList) => IConformanceStatementView;

export interface IConformanceStatementView {
  resourceConformanceStatement: IConformanceStatement[];
  complementConformanceStatements: {
    [type: string]: {
      [name: string]: IConformanceStatement[];
    };
  };
}

export abstract class ConformanceStatementEditorComponent extends AbstractEditorComponent implements OnInit {
  _types = Type;
  conformanceStatementView$: Observable<IConformanceStatementView>;
  selectedResource$: Observable<IResource>;
  constructor(
    readonly repository: StoreResourceRepositoryService,
    private messageService: MessageService,
    private dialog: MatDialog,
    private csService: ConformanceStatementService,
    actions$: Actions,
    store: Store<any>,
    editorMetadata: IEditorMetadata,
    plucker: ConformanceStatementPluck,
    protected resource$: MemoizedSelector<any, IResource>) {
    super(editorMetadata, actions$, store);
    this.conformanceStatementView$ = this.currentSynchronized$.pipe(
      map((data) => {
        return plucker(data.resource);
      }),
    );
    this.selectedResource$ = this.store.select(this.resource$);
  }

  editDialog(cs: IConformanceStatement) {
    this.dialog.open(CsDialogComponent, {
      data: {
        resource: this.selectedResource$,
        cs,
      },
    });
  }

  createCs() {
    this.dialog.open(CsDialogComponent, {
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: {
        resource: this.selectedResource$,
        cs: this.csService.getFreeConformanceStatement(),
      },
    });
  }

  keys(obj) {
    return Object.keys(obj);
  }

  abstract elementSelector(): MemoizedSelectorWithProps<object, { id: string }, IDisplayElement>;

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      concatMap((id) => {
        return this.store.select(this.elementSelector(), { id });
      }),
    );
  }

  onEditorSave(action: EditorSave): Observable<Action> {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {
  }

}
