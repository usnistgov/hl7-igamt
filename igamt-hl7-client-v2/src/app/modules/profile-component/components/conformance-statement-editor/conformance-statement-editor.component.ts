import { OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { Action, MemoizedSelectorWithProps, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { BehaviorSubject, combineLatest, EMPTY, Observable, Subscription, throwError } from 'rxjs';
import { concatMap, flatMap, map, take, tap, pluck, catchError } from 'rxjs/operators';
import { AbstractEditorComponent } from 'src/app/modules/core/components/abstract-editor-component/abstract-editor-component.component';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import { CsDialogComponent } from 'src/app/modules/shared/components/cs-dialog/cs-dialog.component';
import { ConstraintType, IConformanceStatement } from 'src/app/modules/shared/models/cs.interface';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { IHL7EditorMetadata } from 'src/app/modules/shared/models/editor.enum';
import { IPropertyConformanceStatement } from 'src/app/modules/shared/models/profile.component';
import { IResource } from 'src/app/modules/shared/models/resource.interface';
import { ChangeType, IChange, PropertyType } from 'src/app/modules/shared/models/save-change';
import { ConformanceStatementService } from 'src/app/modules/shared/services/conformance-statement.service';
import { StoreResourceRepositoryService } from 'src/app/modules/shared/services/resource-repository.service';
import { selectContextById } from '../../../../root-store/dam-igamt/igamt.resource-display.selectors';
import { ProfileComponentService } from '../../services/profile-component.service';
import { Message } from 'src/app/modules/dam-framework/models/messages/message.class';
import { MessageType } from '../../../dam-framework/models/messages/message.class';
import { selectSelectedProfileComponent } from '../../../../root-store/dam-igamt/igamt.selected-resource.selectors';

export interface IPcConformanceStatementEditorData {
  conformanceStatements: IConformanceStatement[];
  items: IPropertyConformanceStatement[];
}

export interface IConformanceStatementItem {
  item: IPropertyConformanceStatement;
  conformanceStatement: IConformanceStatement;
}

export interface IConformanceStatementItem {
  item: IPropertyConformanceStatement;
  conformanceStatement: IConformanceStatement;
}

export interface IConformanceStatementItemDisplay {
  available: IConformanceStatement[];
  items: IConformanceStatementItem[];
  nonexistent: IPropertyConformanceStatement[];
}

export abstract class ConformanceStatementEditorComponent extends AbstractEditorComponent implements OnInit, OnDestroy {
  selectedResource$: Observable<IResource>;
  resourceConformanceStatements$: Observable<IConformanceStatement[]>;
  items$: BehaviorSubject<IPropertyConformanceStatement[]>;
  conformanceStatementItem$: Observable<IConformanceStatementItemDisplay>;
  profileComponentId$: Observable<string>;
  s_workspace: Subscription;

  constructor(
    readonly repository: StoreResourceRepositoryService,
    private messageService: MessageService,
    protected conformanceStatementService: ConformanceStatementService,
    protected pcService: ProfileComponentService,
    private dialog: MatDialog,
    actions$: Actions,
    store: Store<any>,
    editorMetadata: IHL7EditorMetadata,
    resource$: MemoizedSelectorWithProps<object, { id: string; }, IResource>,
  ) {
    super(editorMetadata, actions$, store);
    this.selectedResource$ = this.elementId$.pipe(
      flatMap((id) => {
        return this.store.select(resource$, { id });
      }),
    );
    this.items$ = new BehaviorSubject([]);
    this.resourceConformanceStatements$ = this.current$.pipe(
      map((current) => {
        return current.data.conformanceStatements;
      }),
    );

    this.profileComponentId$ = this.store.select(selectSelectedProfileComponent).pipe(
      pluck('id'),
    );

    this.conformanceStatementItem$ = combineLatest(
      this.resourceConformanceStatements$,
      this.items$,
    ).pipe(
      map(([csList, itemList]) => {
        const available = csList.filter((cs) => !itemList.find((elm) => elm.targetId === cs.id));

        const mapped = itemList.map((item) => ({
          item,
          conformanceStatement: item.change === ChangeType.ADD ? item.payload : csList.find((elm) => elm.id === item.targetId),
        }));

        return {
          items: mapped.filter((elm) => !!elm.conformanceStatement),
          nonexistent: mapped.filter((elm) => !elm.conformanceStatement).map((e) => e.item),
          available,
        };
      }),
    );

    this.s_workspace = this.currentSynchronized$.pipe(
      map((data: IPcConformanceStatementEditorData) => {
        this.items$.next([...data.items]);
      }),
    ).subscribe();

  }

  removeItemFromList(list: IPropertyConformanceStatement[], item: IPropertyConformanceStatement) {
    const idx = list.findIndex((elm) => elm.targetId === item.targetId);
    const rmList = [...list];
    rmList.splice(idx, 1);
    return rmList;
  }

  clean() {
    this.conformanceStatementItem$.pipe(
      take(1),
      tap((value) => {
        const itemList = this.items$.getValue();
        const clear = value.nonexistent;
        let list = [];
        clear.forEach((elm) => list = this.removeItemFromList(itemList, elm));
        this.items$.next(list);
        this.registerChange(list);
      }),
    ).subscribe();
  }

  createItem(cs: IConformanceStatement, type: ChangeType): IPropertyConformanceStatement {
    return {
      propertyKey: PropertyType.STATEMENT,
      target: '',
      targetId: cs.id,
      payload: type === ChangeType.ADD ? cs : undefined,
      change: type,
    };
  }

  getDescription(cs) {
    if (cs.type === ConstraintType.ASSERTION) {
      return cs.assertion.description;
    } else {
      return cs.freeText;
    }
  }

  addItem(cs: IConformanceStatement, type: ChangeType) {
    const item = this.createItem(cs, type);
    const itemList = this.items$.getValue();
    itemList.push(item);
    this.items$.next([...itemList]);
    this.registerChange([...itemList]);
  }

  deleteItem(item: IPropertyConformanceStatement) {
    const itemList = this.items$.getValue();
    const rmList = this.removeItemFromList(itemList, item);
    this.items$.next([...rmList]);
    this.registerChange([...rmList]);
  }

  excludeCs(cs: IConformanceStatement) {
    this.addItem(cs, ChangeType.DELETE);
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
          this.addItem(cs, ChangeType.ADD);
        }
      },
    );
  }

  registerChange(items: IPropertyConformanceStatement[]) {
    this.resourceConformanceStatements$.pipe(
      take(1),
      map((conformanceStatements) => {
        this.editorChange({
          conformanceStatements,
          items,
        }, true);
      }),
    ).subscribe();
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      concatMap((id) => {
        return this.store.select(selectContextById, { id });
      }),
    );
  }

  onEditorSave(action: fromDam.EditorSave): Observable<Action> {
    return combineLatest(this.current$, this.profileComponentId$, this.elementId$).pipe(
      take(1),
      concatMap(([current, pcId, id]) => {
        return this.pcService.saveRootConformanceStatements(pcId, id, current.data.items).pipe(
          flatMap((value) => {
            return this.pcService.getChildById(pcId, id).pipe(
              flatMap((context) => {
                return [
                  this.messageService.messageToAction(new Message<any>(MessageType.SUCCESS, 'Conformance Statements saved successfully!', null)),
                  new fromDam.EditorUpdate({ value: current.data, updateDate: false }),
                  new fromDam.SetValue({ selected: context }),
                ];
              }),
            );
          }),
          catchError((error) => throwError(this.messageService.actionFromError(error))),
        );
      }),
    );
  }

  ngOnDestroy(): void {
    if (this.s_workspace) {
      this.s_workspace.unsubscribe();
    }
  }

  onDeactivate() {
    this.ngOnDestroy();
  }

  ngOnInit(): void {
  }

}
