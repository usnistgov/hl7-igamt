import { OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { Action, MemoizedSelector, MemoizedSelectorWithProps, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { BehaviorSubject, combineLatest, Observable, ReplaySubject, Subscription, throwError } from 'rxjs';
import { catchError, concatMap, flatMap, map, mergeMap, take, tap } from 'rxjs/operators';
import { IResource } from 'src/app/modules/shared/models/resource.interface';
import { EditorSave, EditorUpdate } from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import { CsDialogComponent } from '../../../shared/components/cs-dialog/cs-dialog.component';
import { Type } from '../../../shared/constants/type.enum';
import { IConformanceStatementList, ICPConformanceStatementList } from '../../../shared/models/cs-list.interface';
import { ConstraintType, IConformanceStatement } from '../../../shared/models/cs.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IEditorMetadata } from '../../../shared/models/editor.enum';
import { ChangeType, IChange, PropertyType } from '../../../shared/models/save-change';
import { ConformanceStatementService } from '../../../shared/services/conformance-statement.service';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { Message } from '../../models/message/message.class';
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
  availableConformanceStatements: IConformanceStatement[];
}

export interface IEditableListNode<T> {
  id: string;
  persisted: boolean;
  changePrototype: IChange<T>;
  payload: T;
}

export abstract class ConformanceStatementEditorComponent extends AbstractEditorComponent implements OnInit, OnDestroy {
  _types = Type;
  conformanceStatementView: ReplaySubject<IConformanceStatementView>;
  conformanceStatementView$: Observable<IConformanceStatementView>;

  selectedResource$: Observable<IResource>;

  editable: BehaviorSubject<Array<IEditableListNode<IConformanceStatement>>>;
  editable$: Observable<Array<IEditableListNode<IConformanceStatement>>>;

  available: BehaviorSubject<IConformanceStatement[]>;
  available$: Observable<IConformanceStatement[]>;

  changes: ReplaySubject<{
    [index: string]: IChange,
  }>;
  s_workspace: Subscription;
  s_view: Subscription;
  s_available: Subscription;

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

    this.editable = new BehaviorSubject<Array<IEditableListNode<IConformanceStatement>>>([]);
    this.editable$ = this.editable.asObservable();

    this.available = new BehaviorSubject<IConformanceStatement[]>([]);
    this.available$ = this.available.asObservable();

    this.changes = new ReplaySubject(1);
    this.selectedResource$ = this.store.select(this.resource$);

    this.conformanceStatementView = new ReplaySubject(1);
    this.conformanceStatementView$ = this.conformanceStatementView.asObservable();

    this.s_workspace = this.currentSynchronized$.pipe(
      tap((data) => {
        if (data.resource) {
          this.conformanceStatementView.next(plucker(data.resource));
        }
        this.changes.next({ ...data.changes });
      }),
    ).subscribe();

    this.s_view = this.conformanceStatementView$.pipe(
      map((view) => {
        return view.resourceConformanceStatement.map((cs) => {
          const changePrototype = this.createPrototypeChange(cs);
          return {
            id: changePrototype.location,
            payload: changePrototype.oldPropertyValue,
            persisted: true,
            changePrototype,
          };
        });
      }),
    ).subscribe(this.editable);

    this.s_available = this.conformanceStatementView$.pipe(
      map((view) => {
        return view.availableConformanceStatements;
      }),
    ).subscribe(this.available);

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

  use(cs: IConformanceStatement, i: number) {
    const changePrototype = {
      location: cs.identifier,
      propertyType: PropertyType.STATEMENT,
      oldPropertyValue: undefined,
      position: undefined,
      changeType: undefined,
      propertyValue: cs,
    };
    this.change(changePrototype, ChangeType.ADD);
    this.addEditableNode(changePrototype);
    this.available.next([
      ..._.without(this.available.getValue(), cs),
    ]);
  }

  addEditableNode(changePrototype: IChange<IConformanceStatement>) {
    this.editable.next([
      ...this.editable.getValue(),
      {
        id: changePrototype.location,
        changePrototype,
        persisted: false,
        payload: changePrototype.propertyValue,
      },
    ]);
  }

  removeEditableNode(node: IEditableListNode<IConformanceStatement>) {
    this.editable.next([
      ..._.without(this.editable.getValue(), node),
    ]);
  }

  createPrototypeChange(cs: IConformanceStatement) {
    return {
      location: cs.identifier,
      propertyType: PropertyType.STATEMENT,
      propertyValue: undefined,
      oldPropertyValue: cs,
      position: undefined,
      changeType: undefined,
    };
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
          node.payload = changed;
          node.changePrototype.propertyValue = changed;
          this.change({
            ...node.changePrototype,
          }, node.persisted ? ChangeType.UPDATE : ChangeType.ADD);
        }
      },
    );
  }

  change(change: IChange, type: ChangeType) {
    combineLatest(this.changes.asObservable(), this.current$.pipe(map((ws) => ws.data))).pipe(
      take(1),
      map(([changes, data]) => {
        changes[change.location] = {
          ...change,
          changeType: type,
        };
        this.changes.next(changes);
        this.editorChange({ changes, resource: data.resource }, true);
      }),
    ).subscribe();
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
          const changePrototype = {
            location: cs.identifier,
            propertyType: PropertyType.STATEMENT,
            oldPropertyValue: undefined,
            position: undefined,
            changeType: undefined,
            propertyValue: cs,
          };
          this.change(changePrototype, ChangeType.ADD);
          this.addEditableNode(changePrototype);
        }
      },
    );
  }

  deleteCs(node: IEditableListNode<IConformanceStatement>) {
    this.change(node.changePrototype, ChangeType.DELETE);
    this.removeEditableNode(node);
    if (node.payload.id) {
      this.restoreAvailable(node.payload);
    }
  }

  restoreAvailable(cs: IConformanceStatement) {
    this.available.next([
      ...this.available.getValue(),
      cs,
    ]);
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
    return combineLatest(this.elementId$, this.ig$.pipe(take(1), map((ig) => ig.id)), this.changes.asObservable()).pipe(
      take(1),
      concatMap(([id, igId, changes]) => {
        return this.saveChanges(id, igId, this.convert(changes)).pipe(
          mergeMap((message) => {
            return this.getById(id, igId).pipe(
              flatMap((resource) => {
                return [this.messageService.messageToAction(message), new EditorUpdate({ value: { changes: {}, resource }, updateDate: false })];
              }),
            );
          }),
          catchError((error) => throwError(this.messageService.actionFromError(error))),
        );
      }),
    );
  }

  abstract saveChanges(id: string, igId: string, changes: IChange[]): Observable<Message>;
  abstract getById(id: string, igId: string): Observable<IConformanceStatementList>;

  convert(changes: {
    [index: string]: IChange,
  }): IChange[] {
    const c = [];
    Object.keys(changes).forEach((id) => {
      c.push(changes[id]);
    });
    return c;
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.s_workspace) {
      this.s_workspace.unsubscribe();
    }

    if (this.s_view) {
      this.s_view.unsubscribe();
    }

    if (this.s_available) {
      this.s_available.unsubscribe();
    }
  }

  onDeactivate() {
    this.ngOnDestroy();
  }
}
