import { OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { Action, MemoizedSelector, MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { Guid } from 'guid-typescript';
import * as _ from 'lodash';
import { BehaviorSubject, combineLatest, Observable, Subscription, throwError } from 'rxjs';
import { catchError, concatMap, filter, flatMap, map, mergeMap, take } from 'rxjs/operators';
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import { IResource } from 'src/app/modules/shared/models/resource.interface';
import { Message } from '../../../dam-framework/models/messages/message.class';
import { MessageService } from '../../../dam-framework/services/message.service';
import { CsDialogComponent } from '../../../shared/components/cs-dialog/cs-dialog.component';
import { Type } from '../../../shared/constants/type.enum';
import { IDocumentRef } from '../../../shared/models/abstract-domain.interface';
import { ConstraintType, IConformanceStatement, IPath } from '../../../shared/models/cs.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IHL7EditorMetadata } from '../../../shared/models/editor.enum';
import { ChangeType, IChange, PropertyType } from '../../../shared/models/save-change';
import { ConformanceStatementService } from '../../../shared/services/conformance-statement.service';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { AbstractEditorComponent } from '../abstract-editor-component/abstract-editor-component.component';

export interface IDependantConformanceStatements {
  resource: IDisplayElement;
  conformanceStatements: IConformanceStatement[];
}

export interface IConformanceStatementEditorData {
  active: Array<IEditableListNode<IConformanceStatement>>;
  dependants: {
    segments?: IDependantConformanceStatements[];
    datatypes?: IDependantConformanceStatements[];
  };
}

export interface IEditableConformanceStatementGroup {
  context: IPath;
  name: string;
  list: Array<IEditableListNode<IConformanceStatement>>;
}

export interface IEditableListNode<T> {
  id: string;
  changeType?: ChangeType;
  original: T;
  payload: T;
}

export abstract class ConformanceStatementEditorComponent extends AbstractEditorComponent implements OnInit, OnDestroy {
  _types = Type;
  selectedResource$: Observable<IResource>;
  conformanceStatementWorkspace$: BehaviorSubject<IConformanceStatementEditorData>;
  conformanceStatementWorkspaceGrouped$: Observable<IEditableConformanceStatementGroup[]>;
  dependants: {
    segments?: IDependantConformanceStatements[];
    datatypes?: IDependantConformanceStatements[];
  };
  s_workspace: Subscription;

  constructor(
    readonly repository: StoreResourceRepositoryService,
    private messageService: MessageService,
    protected conformanceStatementService: ConformanceStatementService,
    private dialog: MatDialog,
    actions$: Actions,
    store: Store<any>,
    editorMetadata: IHL7EditorMetadata,
    protected resource$: MemoizedSelector<any, IResource>) {
    super(editorMetadata, actions$, store);
    this.selectedResource$ = this.store.select(this.resource$);
    this.conformanceStatementWorkspace$ = new BehaviorSubject(undefined);

    this.conformanceStatementWorkspaceGrouped$ = combineLatest(
      this.conformanceStatementWorkspace$.pipe(
        filter((ws) => !!ws),
      ),
      this.selectedResource$,
    ).pipe(
      flatMap(([ws, resource]) => {
        return this.conformanceStatementService.createConformanceStatementGroups(ws, resource, repository);
      }),
    );

    this.s_workspace = this.currentSynchronized$.pipe(
      map((data: IConformanceStatementEditorData) => {
        this.conformanceStatementWorkspace$.next(data);
        this.dependants = data.dependants;
      }),
    ).subscribe();

  }

  createEditableNode(cs: IConformanceStatement): IEditableListNode<IConformanceStatement> {
    return {
      id: Guid.create().toString(),
      payload: cs,
      original: undefined,
      changeType: ChangeType.ADD,
    };
  }

  getCurrentWorkspace() {
    return _.cloneDeep(this.conformanceStatementWorkspace$.getValue());
  }

  addConformanceStatement(cs: IConformanceStatement) {
    const node = this.createEditableNode(cs);
    const ws = this.getCurrentWorkspace();
    ws.active.push(node);
    this.conformanceStatementWorkspace$.next(ws);
    this.registerChange(ws);
  }

  removeNode(node: IEditableListNode<IConformanceStatement>) {
    const ws = this.getCurrentWorkspace();
    const at = ws.active.findIndex((elm) => elm.id === node.id);
    if (node.changeType !== ChangeType.ADD) {
      ws.active.splice(at, 1, {
        ...ws.active[at],
        changeType: ChangeType.DELETE,
      });
    } else {
      ws.active.splice(at, 1);
    }
    this.conformanceStatementWorkspace$.next(ws);
    this.registerChange(ws);
  }

  updateNode(node: IEditableListNode<IConformanceStatement>, cs: IConformanceStatement) {
    const ws = this.getCurrentWorkspace();
    const at = ws.active.findIndex((elm) => elm.id === node.id);
    ws.active.splice(at, 1, {
      ...ws.active[at],
      payload: cs,
      changeType: node.changeType !== ChangeType.ADD ? ChangeType.UPDATE : ChangeType.ADD,
    });
    this.conformanceStatementWorkspace$.next(ws);
    this.registerChange(ws);
  }

  restore(node: IEditableListNode<IConformanceStatement>) {
    const ws = this.getCurrentWorkspace();
    const at = ws.active.findIndex((elm) => elm.id === node.id);
    if (node.changeType === ChangeType.DELETE) {
      ws.active.splice(at, 1, {
        ...ws.active[at],
        payload: _.cloneDeep(ws.active[at].original),
        changeType: undefined,
      });
      this.conformanceStatementWorkspace$.next(ws);
      this.registerChange(ws);
    }
  }

  registerChange(data: IConformanceStatementEditorData) {
    this.editorChange(data, true);
  }

  getDescription(cs) {
    if (cs.type === ConstraintType.ASSERTION) {
      return cs.assertion.description;
    } else {
      return cs.freeText;
    }
  }

  editDialog(node: IEditableListNode<IConformanceStatement>) {
    const dialogRef = this.dialog.open(CsDialogComponent, {
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: {
        title: 'Edit Conformance Statement',
        resource: this.selectedResource$,
        payload: _.cloneDeep(node.payload),
      },
    });

    dialogRef.afterClosed().subscribe(
      (changed: IConformanceStatement) => {
        if (changed) {
          this.updateNode(node, changed);
        }
      },
    );
  }

  createCs() {
    const dialogRef = this.dialog.open(CsDialogComponent, {
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: {
        title: 'Create Conformance Statement',
        resource: this.selectedResource$,
      },
    });

    dialogRef.afterClosed().subscribe(
      (cs: IConformanceStatement) => {
        if (cs) {
          this.addConformanceStatement(cs);
        }
      },
    );
  }

  abstract elementSelector(): MemoizedSelectorWithProps<object, { id: string }, IDisplayElement>;

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      concatMap((id) => {
        return this.store.select(this.elementSelector(), { id });
      }),
    );
  }

  onEditorSave(action: fromDam.EditorSave): Observable<Action> {
    return combineLatest(this.elementId$, this.documentRef$, this.current$).pipe(
      take(1),
      concatMap(([id, documentRef, current]) => {
        return this.saveChanges(id, documentRef, this.convert(current.data.active)).pipe(
          mergeMap((message) => {
            return this.getById(id, documentRef).pipe(
              flatMap((resource) => {
                return [this.messageService.messageToAction(message), new fromDam.EditorUpdate({ value: resource, updateDate: true })];
              }),
            );
          }),
          catchError((error) => {
            return throwError(this.messageService.actionFromError(error));
          }),
        );
      }),
    );
  }

  abstract saveChanges(id: string, documentRef: IDocumentRef, changes: IChange[]): Observable<Message>;
  abstract getById(id: string, documentRef: IDocumentRef): Observable<IConformanceStatementEditorData>;

  convert(active: Array<IEditableListNode<IConformanceStatement>>): IChange[] {
    return active.filter((node) => !!node.changeType).map((node) => {
      return {
        location: node.original ? node.original.id : undefined,
        propertyType: PropertyType.STATEMENT,
        propertyValue: node.payload,
        oldPropertyValue: node.original,
        changeType: node.changeType,
      };
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.s_workspace) {
      this.s_workspace.unsubscribe();
    }
  }

  onDeactivate() {
    this.ngOnDestroy();
  }

}
