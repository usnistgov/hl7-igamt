import { OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { Action, MemoizedSelector, MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { Guid } from 'guid-typescript';
import * as _ from 'lodash';
import { BehaviorSubject, combineLatest, Observable, Subscription, throwError } from 'rxjs';
import { catchError, concatMap, flatMap, map, mergeMap, take, tap } from 'rxjs/operators';
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import { IResource } from 'src/app/modules/shared/models/resource.interface';
import { Message } from '../../../dam-framework/models/messages/message.class';
import { MessageService } from '../../../dam-framework/services/message.service';
import { CsDialogComponent } from '../../../shared/components/cs-dialog/cs-dialog.component';
import { Type } from '../../../shared/constants/type.enum';
import { IDocumentRef } from '../../../shared/models/abstract-domain.interface';
import { IConformanceStatementList } from '../../../shared/models/cs-list.interface';
import { ConstraintType, IConformanceStatement, IPath } from '../../../shared/models/cs.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IDomainInfo } from '../../../shared/models/domain-info.interface';
import { IHL7EditorMetadata } from '../../../shared/models/editor.enum';
import { ChangeType, IChange, PropertyType } from '../../../shared/models/save-change';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { AbstractEditorComponent } from '../abstract-editor-component/abstract-editor-component.component';

export interface IDependantConformanceStatements {
  [id: string]: {
    domainInfo: IDomainInfo;
    conformanceStatements: IConformanceStatement[];
  };
}

export interface IConformanceStatementEditorData {
  active: Array<IEditableListNode<IConformanceStatement>>;
  dependants: {
    segments?: IDependantConformanceStatements;
    datatypes?: IDependantConformanceStatements;
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

  s_workspace: Subscription;
  s_workspace_update: Subscription;

  constructor(
    readonly repository: StoreResourceRepositoryService,
    private messageService: MessageService,
    private dialog: MatDialog,
    actions$: Actions,
    store: Store<any>,
    editorMetadata: IHL7EditorMetadata,
    protected resource$: MemoizedSelector<any, IResource>) {
    super(editorMetadata, actions$, store);
    this.selectedResource$ = this.store.select(this.resource$);
    this.conformanceStatementWorkspace$ = new BehaviorSubject(undefined);
    this.s_workspace = this.currentSynchronized$.pipe(
      tap((data: IConformanceStatementEditorData) => {
        if (this.s_workspace_update) {
          this.s_workspace_update.unsubscribe();
        }

        this.conformanceStatementWorkspace$.next(data);

        this.s_workspace_update = this.conformanceStatementWorkspace$.subscribe((value) => {
          this.registerChange(value.active);
        });
      }),
    ).subscribe();
    this.conformanceStatementWorkspaceGrouped$ = this.conformanceStatementWorkspace$.pipe(
      map((ws) => {
        return [];
      }),
    );
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
  }

  removeNode(node: IEditableListNode<IConformanceStatement>) {
    const ws = this.getCurrentWorkspace();
    const at = ws.active.findIndex((elm) => elm.id === node.id);
    ws.active.splice(at, 1, {
      ...ws.active[at],
      changeType: ChangeType.DELETE,
    });
    this.conformanceStatementWorkspace$.next(ws);
  }

  updateNode(node: IEditableListNode<IConformanceStatement>, cs: IConformanceStatement) {
    const ws = this.getCurrentWorkspace();
    const at = ws.active.findIndex((elm) => elm.id === node.id);
    ws.active.splice(at, 1, {
      ...ws.active[at],
      payload: cs,
      changeType: ChangeType.UPDATE,
    });
    this.conformanceStatementWorkspace$.next(ws);
  }

  registerChange(csList: Array<IEditableListNode<IConformanceStatement>>) {
    this.editorChange(csList, true);
  }

  getId(cs) {
    if (cs.payload) {
      return cs.payload.identifier;
    } else {
      return cs.identifier;
    }
  }

  getDescription(cs) {
    if (cs.payload) {
      if (cs.payload.type === ConstraintType.ASSERTION) {
        return cs.payload.assertion.description;
      } else {
        return cs.payload.freeText;
      }
    } else {
      if (cs.type === ConstraintType.ASSERTION) {
        return cs.assertion.description;
      } else {
        return cs.freeText;
      }
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

  onEditorSave(action: fromDam.EditorSave): Observable<Action> {
    return combineLatest(this.elementId$, this.documentRef$, this.current$).pipe(
      take(1),
      concatMap(([id, documentRef, current]) => {
        return this.saveChanges(id, documentRef, this.convert(current.data)).pipe(
          mergeMap((message) => {
            return this.getById(id, documentRef).pipe(
              flatMap((resource) => {
                return [this.messageService.messageToAction(message), new fromDam.EditorUpdate({ value: { changes: {}, resource }, updateDate: false })];
              }),
            );
          }),
          catchError((error) => throwError(this.messageService.actionFromError(error))),
        );
      }),
    );
  }

  abstract saveChanges(id: string, documentRef: IDocumentRef, changes: IChange[]): Observable<Message>;
  abstract getById(id: string, documentRef: IDocumentRef): Observable<IConformanceStatementList>;

  convert(active: Array<IEditableListNode<IConformanceStatement>>): IChange[] {
    return active.filter((node) => !!node.changeType).map((node) => {
      return {
        location: node.id,
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
