import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Actions} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {Observable, ReplaySubject, Subscription} from 'rxjs';
import {filter, map, mergeMap, take, tap, withLatestFrom} from 'rxjs/operators';
import {selectSelectedResource} from '../../../../root-store/dam-igamt/igamt.selected-resource.selectors';
import {MessageService} from '../../../dam-framework/services/message.service';
import {EditorSave} from '../../../dam-framework/store/data';
import {IStructureChanges} from '../../../segment/components/segment-structure-editor/segment-structure-editor.component';
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
import {PathService} from '../../../shared/services/path.service';
import {StoreResourceRepositoryService} from '../../../shared/services/resource-repository.service';
import {SlicingService} from '../../../shared/services/slicing.service';
import {IHL7v2TreeFilter, RestrictionCombinator, RestrictionType} from '../../../shared/services/tree-filter.service';
import {AbstractEditorComponent} from '../abstract-editor-component/abstract-editor-component.component';

@Component({
  selector: 'app-slicing-editor',
  templateUrl: './slicing-editor.component.html',
  styleUrls: ['./slicing-editor.component.css'],
})
export abstract class SlicingEditorComponent<T extends IResource> extends AbstractEditorComponent implements OnInit, OnDestroy {

  selectedResource$: Observable<IResource>;
  s_workspace: Subscription;
  tree_s: Subscription;
  resourceType: Type;
  derived$: Observable<boolean>;
  resource$: Observable<IResource>;
  nodes: IHL7v2TreeNode[];
  resourceSubject: ReplaySubject<ISlicing[]>;
  resources$: Observable<IDisplayElement[]>;
  changes: ReplaySubject<IStructureChanges>;
  constructor(
    readonly repository: StoreResourceRepositoryService,
    public messageService: MessageService,
    public slicingService: SlicingService,
    public hl7V2TreeService: Hl7V2TreeService,
    public pathService: PathService,
    public dialog: MatDialog,
    actions$: Actions,
    store: Store<any>,
    editorMetadata: IHL7EditorMetadata,
) {
    super( editorMetadata , actions$, store);

    this.resourceSubject = new ReplaySubject<ISlicing[]>(1);
    this.changes = new ReplaySubject<IStructureChanges>(1);
    this.selectedResource$ = this.store.select(selectSelectedResource);
    this.s_workspace = this.currentSynchronized$.pipe(
      map((current) => {
        this.resourceSubject.next(current.slicing);
        this.changes.next({...current.changes});
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
                rootPath: {elementId: resource.id},
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

  editorDisplayNode(): Observable<IDisplayElement>;
  editorDisplayNode(): Observable<any>;
  editorDisplayNode(): Observable<IDisplayElement> | Observable<any> {
    return undefined;
  }
  abstract getAllResources(): Observable<IDisplayElement[]>;

  abstract getReferenceType(): Type;

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
    this.resourceSubject.pipe(take(1), map((slicing) => {
      const dialogRef = this.dialog.open(SelectSlicingContextComponent, {
        data: {nodes: this.nodes, treeFilter: {
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
                value: slicing.map((x) =>  this.pathService.pathToString(this.pathService.trimPathRoot(x.path))).map((path) => {
                  return {
                    path,
                  };
                }),
              },
            ],
          }, resource$: this.selectedResource$},
      });
      dialogRef.afterClosed().pipe(
        filter((x) => x !== undefined),
        take(1),
        tap(( x) => {
          this.updateSlicing(x, slicing);
        }),
      ).subscribe();
    })).subscribe();
  }

  private updateSlicing(ret: ISlicingReturn, slicings: ISlicing[]) {
    slicings.push({
      type: ret.slicingType,
      path: ret.path,
      slices: [],
    });
    this.resourceSubject.next(slicings);
  }

}
export interface IPathOptions {
  path: IPath;
  options: IDisplayElement[];
  display: IDisplayElement;
}
