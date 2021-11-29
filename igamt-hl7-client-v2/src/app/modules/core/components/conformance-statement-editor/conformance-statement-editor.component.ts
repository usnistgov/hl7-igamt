import { OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { Action, MemoizedSelector, MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { Guid } from 'guid-typescript';
import * as _ from 'lodash';
import { BehaviorSubject, combineLatest, Observable, Subscription, throwError } from 'rxjs';
import { catchError, concatMap, filter, flatMap, map, mergeMap, take, tap } from 'rxjs/operators';
import { IVerificationEnty } from 'src/app/modules/dam-framework';
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import { EditorVerificationResult, EditorVerify } from 'src/app/modules/dam-framework/store/index';
import { IResource } from 'src/app/modules/shared/models/resource.interface';
import { IVerificationIssue } from 'src/app/modules/shared/models/verification.interface';
import { selectedResourceHasOrigin } from 'src/app/root-store/dam-igamt/igamt.selected-resource.selectors';
import { selectDerived } from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { Message } from '../../../dam-framework/models/messages/message.class';
import { MessageService } from '../../../dam-framework/services/message.service';
import { ChangeReasonListDialogComponent } from '../../../shared/components/change-reason-list-dialog/change-reason-list-dialog.component';
import { CsDialogComponent } from '../../../shared/components/cs-dialog/cs-dialog.component';
import { Type } from '../../../shared/constants/type.enum';
import { IDocumentRef } from '../../../shared/models/abstract-domain.interface';
import { ConstraintType, IConformanceStatement, IPath } from '../../../shared/models/cs.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IHL7EditorMetadata } from '../../../shared/models/editor.enum';
import { ChangeType, IChange, IChangeReason, PropertyType } from '../../../shared/models/save-change';
import { ConformanceStatementService } from '../../../shared/services/conformance-statement.service';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { AbstractEditorComponent } from '../abstract-editor-component/abstract-editor-component.component';

export interface IDependantConformanceStatements {
  resource: IDisplayElement;
  conformanceStatements: IConformanceStatement[];
}

export interface IConformanceStatementEditorData {
  active: Array<IEditableListNode<IConformanceStatement>>;
  changeReasons: {
    reasons: IChangeReason[];
    updated: IChangeReason[];
  };
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
  changeReason$: BehaviorSubject<IChangeReason[]>;
  dependants: {
    segments?: IDependantConformanceStatements[];
    datatypes?: IDependantConformanceStatements[];
  };
  s_workspace: Subscription;
  entries$: Observable<Record<string, IVerificationEnty[]>>;
  derived$: Observable<boolean>;

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
    this.changeReason$ = new BehaviorSubject(undefined);

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
        this.changeReason$.next(data.changeReasons ? data.changeReasons.reasons : undefined);
        this.dependants = data.dependants;
      }),
    ).subscribe();

    this.derived$ = combineLatest(
      this.store.select(selectDerived),
      this.store.select(selectedResourceHasOrigin),
    ).pipe(
      map(([derivedIg, elmHadOrigin]) => {
        return derivedIg && elmHadOrigin;
      }),
    );

    this.entries$ = this.getGroupedEntries();
  }

  getGroupedEntries(): Observable<Record<string, IVerificationEnty[]>> {
    return this.getEditorVerificationEntries().pipe(
      map((entries) => {
        return entries.reduce((acc, entry) => {
          return {
            ...acc,
            [entry.pathId]: [
              ...(acc[entry.pathId] || []),
              entry,
            ],
          };
        }, {} as Record<string, IVerificationEnty[]>);
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
    this.registerChange(ws);
  }

  updateChangeReasons(reasons: IChangeReason[]) {
    const ws: IConformanceStatementEditorData = this.getCurrentWorkspace();
    const updated: IConformanceStatementEditorData = {
      ...this.getCurrentWorkspace(),
      changeReasons: {
        ...ws.changeReasons,
        updated: reasons,
      },
    };
    this.changeReason$.next(reasons);
    this.conformanceStatementWorkspace$.next(updated);
    this.registerChange(updated);
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
    this.toggleChangeReason(undefined, node.original);
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
      this.toggleChangeReason(node.original, undefined);
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
          this.toggleChangeReason(changed, node.original);
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
          this.toggleChangeReason(cs, undefined);
        }
      },
    );
  }

  toggleChangeReason(current: IConformanceStatement, previous: IConformanceStatement) {
    this.derived$.pipe(
      take(1),
      filter((derived) => derived),
      tap(() => {
        const dialogRef = this.dialog.open(ChangeReasonListDialogComponent, {
          maxWidth: '95vw',
          maxHeight: '90vh',
          data: {
            changeReason: this.changeReason$.getValue(),
            edit: false,
            current: this.getCsDescriptor(current),
            previous: this.getCsDescriptor(previous),
          },
        });

        dialogRef.afterClosed().subscribe(
          (changes) => {
            if (changes) {
              this.updateChangeReasons(changes);
            }
          },
        );
      }),
    ).subscribe();
  }

  getCsDescriptor(value: IConformanceStatement): { id: string, description: string } {
    return value ? {
      id: value.identifier,
      description: this.getDescription(value),
    } : undefined;
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

  onEditorVerify(action: EditorVerify): Observable<Action> {
    return combineLatest(this.elementId$, this.documentRef$).pipe(
      take(1),
      concatMap(([id, documentRef]) => {
        return this.verify(id, documentRef).pipe(
          flatMap((entries) => {
            return [
              new EditorVerificationResult({
                supported: true,
                entries: entries.map((entry) => ({
                  code: entry.code,
                  message: entry.description,
                  location: entry.locationInfo.name,
                  pathId: entry.locationInfo.pathId,
                  property: entry.locationInfo.property,
                  severity: entry.severity,
                  targetId: entry.target,
                  targetType: entry.targetType,
                }) as IVerificationEnty).filter((entry) => {
                  return [PropertyType.STATEMENT].includes(entry.property as PropertyType);
                }),
              }),
            ];
          }),
        );
      }),
    );
  }

  abstract saveChanges(id: string, documentRef: IDocumentRef, changes: IChange[]): Observable<Message>;
  abstract getById(id: string, documentRef: IDocumentRef): Observable<IConformanceStatementEditorData>;
  abstract verify(id: string, documentInfo: IDocumentRef): Observable<IVerificationIssue[]>;

  convert(ws: IConformanceStatementEditorData): Array<IChange<IConformanceStatement | IChangeReason[]>> {
    const active = ws.active;
    const changes: Array<IChange<IConformanceStatement | IChangeReason[]>> = active.filter((node) => !!node.changeType).map((node) => {
      return {
        location: node.original ? node.original.id : undefined,
        propertyType: PropertyType.STATEMENT,
        propertyValue: node.payload,
        oldPropertyValue: node.original,
        changeType: node.changeType,
      };
    });

    if (ws.changeReasons && ws.changeReasons.updated) {
      changes.push({
        location: undefined,
        propertyType: PropertyType.CSCHANGEREASON,
        propertyValue: ws.changeReasons.updated,
        oldPropertyValue: ws.changeReasons.reasons,
        changeType: ChangeType.UPDATE,
      });
    }

    return changes;
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
