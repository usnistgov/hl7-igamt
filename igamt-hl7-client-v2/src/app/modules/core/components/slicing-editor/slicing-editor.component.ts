import { OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions } from '@ngrx/effects';
import { Action, MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { combineLatest, Observable, ReplaySubject, Subscription, throwError } from 'rxjs';
import { catchError, concatMap, filter, flatMap, map, mergeMap, take, tap } from 'rxjs/operators';
import { selectSelectedResource } from '../../../../root-store/dam-igamt/igamt.selected-resource.selectors';
import { Message } from '../../../dam-framework/models/messages/message.class';
import { MessageService } from '../../../dam-framework/services/message.service';
import * as fromDam from '../../../dam-framework/store';
import { IHL7v2TreeNode } from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import {
  ISlicingReturn,
  SelectSlicingContextComponent,
} from '../../../shared/components/select-sling-context/select-slicing-context.component';
import { Type } from '../../../shared/constants/type.enum';
import { IDocumentRef } from '../../../shared/models/abstract-domain.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IHL7EditorMetadata } from '../../../shared/models/editor.enum';
import { IResource } from '../../../shared/models/resource.interface';
import { ChangeType, IChange, PropertyType } from '../../../shared/models/save-change';
import { ISlicing } from '../../../shared/models/slicing';
import { Hl7V2TreeService } from '../../../shared/services/hl7-v2-tree.service';
import { PathService } from '../../../shared/services/path.service';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { SlicingService } from '../../../shared/services/slicing.service';
import { RestrictionCombinator, RestrictionType } from '../../../shared/services/tree-filter.service';
import { AbstractEditorComponent } from '../abstract-editor-component/abstract-editor-component.component';

export abstract class SlicingEditorComponent extends AbstractEditorComponent implements OnInit, OnDestroy {

  selectedResource$: Observable<IResource>;
  s_workspace: Subscription;
  tree_s: Subscription;
  resourceType: Type;
  derived$: Observable<boolean>;
  resource$: Observable<IResource>;
  nodes: IHL7v2TreeNode[];
  resourceSubject: ReplaySubject<ISlicing[]>;
  resources$: Observable<IDisplayElement[]>;
  changes: ReplaySubject<ISlicingChange>;
  protected constructor(
    readonly repository: StoreResourceRepositoryService,
    public messageService: MessageService,
    public slicingService: SlicingService,
    public hl7V2TreeService: Hl7V2TreeService,
    public pathService: PathService,
    public dialog: MatDialog,
    actions$: Actions,
    store: Store<any>,
    public editorMetadata: IHL7EditorMetadata,
  ) {
    super(editorMetadata, actions$, store);

    this.resourceSubject = new ReplaySubject<ISlicing[]>(1);
    this.changes = new ReplaySubject<ISlicingChange>(1);
    this.selectedResource$ = this.store.select(selectSelectedResource);
    this.s_workspace = this.currentSynchronized$.pipe(
      map((current) => {
        this.resourceSubject.next(current.slicing);
        this.changes.next({ ...current.changes });
      }),
    ).subscribe();
    this.resources$ = this.getAllResources().pipe(take(1));
    this.selectedResource$.pipe(take(1), tap((resource) => {
      this.tree_s = this.hl7V2TreeService.getTree(resource, this.repository, true, true, (value) => {
        this.nodes = [
          {
            data: {
              id: resource.id,
              pathId: resource.id,
              name: resource.name,
              type: resource.type,
              rootPath: { elementId: resource.id },
              position: 0,
            },
            children: [...value],
            leaf: false,
            key: resource.id,
            expanded: true,
          },
        ];
      });
    },
    )).subscribe();
  }
  ngOnInit() {
  }

  abstract elementSelector(): MemoizedSelectorWithProps<object, { id: string }, IDisplayElement>;

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      concatMap((id) => {
        return this.store.select(this.elementSelector(), { id });
      }),
    );
  }

  abstract getAllResources(): Observable<IDisplayElement[]>;

  abstract getReferenceType(): Type;

  abstract saveChanges(id: string, documentRef: IDocumentRef, changes: IChange[]): Observable<Message>;
  abstract getById(id: string): Observable<IResource>;
  ngOnDestroy(): void {
  }

  onDeactivate(): void {
  }

  onEditorSave(action: fromDam.EditorSave): Observable<Action> {
    return combineLatest(this.elementId$, this.documentRef$, this.changes.asObservable()).pipe(
      take(1),
      concatMap(([id, documentRef, changes]) => {
        return this.saveChanges(id, documentRef, Object.values(changes)).pipe(
          mergeMap((message) => {
            return this.getById(id).pipe(
              flatMap((resource) => {
                this.changes.next({});
                this.resourceSubject.next(this.slicingService.order(resource.slicings));
                return [this.messageService.messageToAction(message), new fromDam.EditorUpdate({ value: { changes: {}, resource: resource.slicings }, updateDate: false }), new fromDam.SetValue({ selected: resource })];
              }),
            );
          }),
          catchError((error) => throwError(this.messageService.actionFromError(error))),
        );
      }),
    );
  }

  addItems() {
    this.resourceSubject.pipe(take(1), map((slicing) => {
      const dialogRef = this.dialog.open(SelectSlicingContextComponent, {
        data: {
          nodes: this.nodes, treeFilter: {
            hide: false,
            restrictions: [
              {
                criterion: RestrictionType.TYPE,
                allow: true,
                value: [this.getReferenceType()],
              },
              {
                criterion: RestrictionType.PATH,
                allow: false,
                combine: RestrictionCombinator.ENFORCE,
                value: slicing.map((x) => this.pathService.pathToString(this.pathService.getPathFromPathId(x.path))).map((path) => {
                  return {
                    path,
                  };
                }),
              },
            ],
          }, resource$: this.selectedResource$,
        },
      });
      dialogRef.afterClosed().pipe(
        filter((x) => x !== undefined),
        take(1),
        tap((x) => {
          this.updateSlicing(x);
        }),
      ).subscribe();
    })).subscribe();
  }
  change(change: IChange) {
    combineLatest(this.changes.asObservable(), this.resourceSubject).pipe(
      take(1),
      map(([changes, slicings]) => {
        changes[change.location] = change;
        slicings = this.applyChange(slicings, change);
        this.resourceSubject.next(slicings);
        this.changes.next(changes);
        this.editorChange({ changes, slicings }, true);
      }),
    ).subscribe();
  }

  applyChange(slicings: ISlicing[], change: IChange): ISlicing[] {
    let ret = [];
    if (change.changeType === ChangeType.ADD) {
      ret = [this.createSlicingFromChange(change), ...slicings];
    } else if (change.changeType === ChangeType.UPDATE) {
      ret = [...slicings].map((x) => {
        if (x.path !== change.location) {
          return { ...x };
        } else {
          return this.createSlicingFromChange(change);
        }
      });
    } else if (change.changeType === ChangeType.DELETE) {
      ret = [...slicings].filter((x) => change.location !== x.path);
    }
    return this.slicingService.order(ret);
  }

  createSlicingFromChange(change: IChange): ISlicing {
    return {
      type: change.propertyValue.type,
      path: change.propertyValue.path,
      slices: change.propertyValue.slices,
    };
  }

  private updateSlicing(ret: ISlicingReturn) {
    const path = this.pathService.pathToString(this.pathService.trimPathRoot(ret.path));
    const slicing: ISlicing = {
      type: ret.slicingType,
      path,
      slices: [],
    };
    this.change({
      changeType: ChangeType.ADD,
      propertyType: PropertyType.SLICING,
      propertyValue: slicing,
      location: path,
    });
  }
}

export interface ISlicingChange {
  [location: string]: IChange;
}
