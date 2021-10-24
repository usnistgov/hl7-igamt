import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Actions} from '@ngrx/effects';
import {Action, MemoizedSelector, Store} from '@ngrx/store';
import {BehaviorSubject, combineLatest, Observable, ReplaySubject, Subscription} from 'rxjs';
import {filter, flatMap, map, mergeMap, take, tap, withLatestFrom, concatMap} from 'rxjs/operators';
import {
  selectAllDatatypes, selectDatatypes,
  selectDatatypesByFixedName
} from '../../../../root-store/dam-igamt/igamt.resource-display.selectors';
import {selectSelectedResource} from '../../../../root-store/dam-igamt/igamt.selected-resource.selectors';
import {AbstractEditorComponent} from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import {MessageService} from '../../../dam-framework/services/message.service';
import {EditorSave} from '../../../dam-framework/store/data';
import {IHL7v2TreeNode, IResourceRef} from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import {
  ISlicingReturn,
  SelectSlicingContextComponent
} from '../../../shared/components/select-sling-context/select-slicing-context.component';
import {IStructureTreeSelect} from '../../../shared/components/structure-tree/structure-tree.component';
import {Type} from '../../../shared/constants/type.enum';
import {IPath} from '../../../shared/models/cs.interface';
import {IDisplayElement} from '../../../shared/models/display-element.interface';
import {EditorID, IHL7EditorMetadata} from '../../../shared/models/editor.enum';
import {IResource} from '../../../shared/models/resource.interface';
import {ISlicing} from '../../../shared/models/slicing';
import {Hl7V2TreeService} from '../../../shared/services/hl7-v2-tree.service';
import {StoreResourceRepositoryService} from '../../../shared/services/resource-repository.service';
import {SlicingService} from '../../../shared/services/slicing.service';
import {IHL7v2TreeFilter, RestrictionType} from '../../../shared/services/tree-filter.service';
import {IStructureChanges} from '../segment-structure-editor/segment-structure-editor.component';

@Component({
  selector: 'app-segment-slicing-editor',
  templateUrl: './segment-slicing-editor.component.html',
  styleUrls: ['./segment-slicing-editor.component.css'],
})
export class SegmentSlicingEditorComponent extends AbstractEditorComponent implements OnInit, OnDestroy {

  selectedResource$: Observable<IResource>;
  s_workspace: Subscription;
  tree_s: Subscription;
  resourceType: Type;
  derived$: Observable<boolean>;
  resource$: Observable<IResource>;
  nodes: IHL7v2TreeNode[];
  resourceSubject: ReplaySubject<ISlicing[]>;
  datatypes$: Observable<IDisplayElement[]>;
  changes: ReplaySubject<IStructureChanges>;
  segmentTreeFilter: IHL7v2TreeFilter = {
    hide: false,
    restrictions: [
      {
        criterion: RestrictionType.TYPE,
        allow: true,
        value: [Type.FIELD],
      },
    ],
  };
  private sliceRow: any;
  constructor(
    readonly repository: StoreResourceRepositoryService,
    private messageService: MessageService,
    private slicingService: SlicingService,
    public hl7V2TreeService: Hl7V2TreeService,
    private dialog: MatDialog,
    actions$: Actions,
    store: Store<any>) {
    super(    {
      id: EditorID.SEGMENT_SLICING,
      title: 'Slicing',
      resourceType: Type.SEGMENT,
    }, actions$, store);

    this.resourceSubject = new ReplaySubject<ISlicing[]>(1);
    this.changes = new ReplaySubject<IStructureChanges>(1);
    this.selectedResource$ = this.store.select(selectSelectedResource);
    this.s_workspace = this.currentSynchronized$.pipe(
      map((current) => {
        this.resourceSubject.next(current.slicing);
        this.changes.next({...current.changes});
      }),
    ).subscribe();
    this.datatypes$ = this.store.select(selectAllDatatypes).pipe(take(1));
    this.selectedResource$.pipe(take(1), tap((resource) => {
        this.tree_s = this.hl7V2TreeService.getTree(resource, this.repository, true, true, (value) => {
          this.nodes = [
            {
              data: {
                id: resource.id,
                pathId: resource.id,
                name: resource.name,
                type: resource.type,
                rootPath: {elementId: resource.id},
                position: 0,
              },
              children: [...value],
              parent: undefined,
              expanded: true,
            },
          ];
        });
      },
    )).subscribe();
  }
  ngOnInit() {
  }

  editorDisplayNode(): Observable<IDisplayElement>;
  editorDisplayNode(): Observable<any>;
  editorDisplayNode(): Observable<IDisplayElement> | Observable<any> {
    return undefined;
  }

  ngOnDestroy(): void {
  }

  onDeactivate(): void {
  }

  onEditorSave(action: EditorSave): Observable<Action> {
    return undefined;
  }

  selectSegment($event: IStructureTreeSelect) {
    console.log($event);
  }

  addItems() {
          const dialogRef = this.dialog.open(SelectSlicingContextComponent, {
            data: { nodes: this.nodes, treeFilter: this.segmentTreeFilter },
          });
          dialogRef.afterClosed().pipe(
            filter((x) => x !== undefined),
            withLatestFrom(this.resourceSubject),
            take(1),
            tap(([x, y]) => {
              console.log(x);
              console.log(y);
              this.updateSlicing(x, y);
            }),
          ).subscribe();

  }

  private updateSlicing(ret: ISlicingReturn, slicings: ISlicing[]) {
    slicings.push({
      type: ret.slicingType,
      path: ret.path,
      slices: [],
    });
    this.resourceSubject.next(slicings);
  }

  getNodeByPath(path: IPath): Observable<IHL7v2TreeNode> {
    return this.hl7V2TreeService.getNodeByPath(this.nodes, path, this.repository).pipe(take(1));
  }

  getDisplay(path: IPath): Observable<IDisplayElement> {
    return this.hl7V2TreeService.getNodeByPath(this.nodes, path, this.repository).pipe(
      take(1),
      mergeMap((node) => {
        const ref: IResourceRef = node.data.ref.getValue();
        return this.repository.getResourceDisplay(ref.type, ref.id);
      }));
  }

  getAvailable(path: IPath): Observable<IDisplayElement[]> {
    return this.getDisplay(path).pipe(
      take(1),
      withLatestFrom(this.datatypes$),
      take(1),
      map(([dt, all] ) => {
        const ret = [];
        return [... all].filter((x) => x.fixedName === dt.fixedName);
      })).pipe(take(1));
  }
}
export interface IPathOptions {
  path: IPath;
  options: IDisplayElement[];
  display: IDisplayElement;
}
