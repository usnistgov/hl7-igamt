import { OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { Action, MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { Guid } from 'guid-typescript';
import * as _ from 'lodash';
import { BehaviorSubject, combineLatest, Observable, of, Subscription, throwError } from 'rxjs';
import { catchError, concatMap, flatMap, map, mergeMap, pluck, take, tap, withLatestFrom } from 'rxjs/operators';
import { AbstractEditorComponent } from 'src/app/modules/core/components/abstract-editor-component/abstract-editor-component.component';
import { Message } from 'src/app/modules/dam-framework/models/messages/message.class';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import { CsDialogComponent } from 'src/app/modules/shared/components/cs-dialog/cs-dialog.component';
import { ConstraintType, IConformanceStatement } from 'src/app/modules/shared/models/cs.interface';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { IHL7EditorMetadata } from 'src/app/modules/shared/models/editor.enum';
import { IPropertyConformanceStatement } from 'src/app/modules/shared/models/profile.component';
import { IResource } from 'src/app/modules/shared/models/resource.interface';
import { ChangeType, PropertyType } from 'src/app/modules/shared/models/save-change';
import { ConformanceStatementService } from 'src/app/modules/shared/services/conformance-statement.service';
import { AResourceRepositoryService, StoreResourceRepositoryService } from 'src/app/modules/shared/services/resource-repository.service';
import { selectViewOnly } from 'src/app/root-store/dam-igamt/igamt.selectors';
import { selectDelta } from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { selectContextById } from '../../../../root-store/dam-igamt/igamt.resource-display.selectors';
import {
  selectSelectedProfileComponent,
} from '../../../../root-store/dam-igamt/igamt.selected-resource.selectors';
import { selectProfileComponentContext } from '../../../../root-store/dam-igamt/igamt.selected-resource.selectors';
import { MessageType } from '../../../dam-framework/models/messages/message.class';
import { IPath } from '../../../shared/models/cs.interface';
import { PathService } from '../../../shared/services/path.service';
import { ProfileComponentService } from '../../services/profile-component.service';

export interface IPcConformanceStatementEditorData {
  conformanceStatements: IConformanceStatement[];
  items: IPropertyConformanceStatement[];
}

export interface IConformanceStatementItem {
  item: IPropertyConformanceStatement;
  conformanceStatement: IConformanceStatement;
}

export interface IConformanceStatementDisplay {
  groups: IConformanceStatementItemDisplayGroup[];
  nonexistent: IPropertyConformanceStatement[];
}

export interface IConformanceStatementItemDisplayGroup {
  context: IPath;
  name: string;
  available: IConformanceStatement[];
  items: IConformanceStatementItem[];
}

export interface IConformanceStatementItemGroup {
  context: IPath;
  name: string;
  list: IConformanceStatementItem[];
}

export interface IConformanceStatementList {
  available: IConformanceStatement[];
  items: IConformanceStatementItem[];
}

export abstract class ConformanceStatementEditorComponent extends AbstractEditorComponent implements OnInit, OnDestroy {
  selectedResource$: Observable<IResource>;
  resourceConformanceStatements$: Observable<IConformanceStatement[]>;
  items$: BehaviorSubject<IPropertyConformanceStatement[]>;
  conformanceStatementItem$: Observable<IConformanceStatementDisplay>;
  profileComponentId$: Observable<string>;
  s_workspace: Subscription;
  hide: Record<string, boolean> = {};

  constructor(
    readonly repository: StoreResourceRepositoryService,
    private messageService: MessageService,
    protected conformanceStatementService: ConformanceStatementService,
    protected pcService: ProfileComponentService,
    protected pathService: PathService,
    private dialog: MatDialog,
    actions$: Actions,
    store: Store<any>,
    editorMetadata: IHL7EditorMetadata,
    resource$: MemoizedSelectorWithProps<object, { id: string; }, IResource>,
  ) {
    super(editorMetadata, actions$, store);
    this.selectedResource$ = this.store.select(selectProfileComponentContext).pipe(
      flatMap((context) => {
        return this.store.select(resource$, { id: context.sourceId });
      }),
    );

    this._viewOnly$ = combineLatest(
      this.store.select(selectViewOnly),
      this.store.select(selectDelta),
      this.store.select(selectSelectedProfileComponent)).pipe(
        map(([vOnly, delta, pc]) => {
          return vOnly || delta || pc.derived;
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
      withLatestFrom(this.selectedResource$),
      flatMap(([[list, itemList], resource]) => {
        const merged = this.merge(list || [], itemList || []);
        return this.createConformanceStatementGroupsFromList(merged.items, resource, repository).pipe(
          map((groups) => {
            return {
              groups: groups.map((g) => this.groupSplit(g)),
              nonexistent: merged.unmapped,
            };
          }),
        );
      }),
    );

    this.s_workspace = this.currentSynchronized$.pipe(
      map((data: IPcConformanceStatementEditorData) => {
        this.items$.next([...data.items]);
      }),
    ).subscribe();

  }

  toggle(id: string) {
    this.hide[id] = !this.hide[id];
  }

  merge(csList: IConformanceStatement[], itemList: IPropertyConformanceStatement[]): { items: IConformanceStatementItem[], unmapped: IPropertyConformanceStatement[] } {
    const process = itemList.reduce(({ leftOverCsList, unmapped, items }, item) => {
      if (item.change === ChangeType.ADD) {
        return {
          items: [
            ...items,
            { item, conformanceStatement: item.payload },
          ],
          unmapped,
          leftOverCsList,
        };
      } else if (item.change === ChangeType.DELETE) {
        const idx = leftOverCsList.findIndex((elm) => elm.id === item.targetId);
        if (idx !== -1) {
          const left = [...leftOverCsList];
          left.splice(idx, 1);
          return {
            items: [
              ...items,
              { item, conformanceStatement: leftOverCsList[idx] },
            ],
            unmapped,
            leftOverCsList: left,
          };
        } else {
          return {
            items: [
              ...items,
            ],
            unmapped: [
              ...unmapped,
              item,
            ],
            leftOverCsList,
          };
        }
      }
    }, { leftOverCsList: csList, unmapped: [], items: [] });

    return {
      items: [
        ...process.items,
        ...process.leftOverCsList.map((cs) => ({
          conformanceStatement: cs,
        })),
      ],
      unmapped: process.unmapped,
    };
  }

  groupSplit(group: IConformanceStatementItemGroup): IConformanceStatementItemDisplayGroup {
    return {
      ...group,
      available: group.list.filter((elm) => !elm.item).map((elm) => elm.conformanceStatement),
      items: group.list.filter((elm) => !!elm.item),
    };
  }

  createConformanceStatementGroupsFromList(list: IConformanceStatementItem[], resource: IResource, repository: AResourceRepositoryService): Observable<IConformanceStatementItemGroup[]> {
    if (list.length > 0) {

      const grouped = list.reduce((acc, elm) => {
        const path = this.pathService.pathToString(elm.conformanceStatement.context);
        if (acc[path]) {
          acc[path].list.push(elm);
        } else {
          acc[path] = {
            context: elm.conformanceStatement.context,
            list: [elm],
            name: '',
          };
        }
        return acc;
      }, {} as Map<string, IConformanceStatementItemGroup>);

      return combineLatest(
        Object
          .values(grouped)
          .sort((a) => {
            return !a.context ? -1 : 1;
          })
          .map((group) => {
            return this.conformanceStatementService.getGroupName<IConformanceStatementItem>(group, resource, repository);
          }),
      );
    } else {
      return of([
        {
          context: undefined,
          name: '',
          list: [],
        },
      ]);
    }
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

  editItem(item: IPropertyConformanceStatement) {
    if (item.change === ChangeType.ADD && item.payload) {
      this.store.select(selectProfileComponentContext).pipe(
        take(1),
        mergeMap((context) => {
          const transformer = this.pcService.getProfileComponentItemTransformer(context);
          const referenceChangeMap = this.pcService.getRefChangeMap(context);

          const dialogRef = this.dialog.open(CsDialogComponent, {
            maxWidth: '95vw',
            maxHeight: '90vh',
            data: {
              title: 'Edit Conformance Statement',
              resource: this.selectedResource$,
              payload: _.cloneDeep(item.payload),
              transformer,
              referenceChangeMap,
            },
          });

          return dialogRef.afterClosed().pipe(
            tap((cs: IConformanceStatement) => {
              if (cs) {
                const itemList = this.items$.getValue();
                const editList = itemList.map((i) => {
                  return i.payload.id !== cs.id ? i : {
                    ...item,
                    payload: cs,
                  };
                });
                this.items$.next([...editList]);
                this.registerChange([...editList]);
              }
            },
            ));
        }),
      ).subscribe();
    }

  }

  excludeCs(cs: IConformanceStatement) {
    this.addItem(cs, ChangeType.DELETE);
  }

  createCs() {
    this.store.select(selectProfileComponentContext).pipe(
      take(1),
      mergeMap((context) => {
        const transformer = this.pcService.getProfileComponentItemTransformer(context);
        const referenceChangeMap = this.pcService.getRefChangeMap(context);

        const dialogRef = this.dialog.open(CsDialogComponent, {
          maxWidth: '95vw',
          maxHeight: '90vh',
          data: {
            title: 'Create Conformance Statement',
            resource: this.selectedResource$,
            transformer,
            referenceChangeMap,
          },
        });

        return dialogRef.afterClosed().pipe(
          tap((cs: IConformanceStatement) => {
            if (cs) {
              cs.id = Guid.create().toString();
              this.addItem(cs, ChangeType.ADD);
            }
          }),
        );
      }),
    ).subscribe();
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
                  new fromDam.SetValue({ context }),
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
