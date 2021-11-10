import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import _ from 'lodash';
import {Observable} from 'rxjs';
import {filter, map, mergeMap, take, tap} from 'rxjs/operators';
import {IPath} from '../../models/cs.interface';
import {IDisplayElement} from '../../models/display-element.interface';
import {IResource} from '../../models/resource.interface';
import {ChangeType, IChange, PropertyType} from '../../models/save-change';
import {IConditionalSlice, IOrderedSlice, ISlice, ISlicing, ISlicingMethodType} from '../../models/slicing';
import {ElementNamingService} from '../../services/element-naming.service';
import {Hl7V2TreeService} from '../../services/hl7-v2-tree.service';
import {PathService} from '../../services/path.service';
import {StoreResourceRepositoryService} from '../../services/resource-repository.service';
import {SlicingService} from '../../services/slicing.service';
import {CsDialogComponent} from '../cs-dialog/cs-dialog.component';
import {IHL7v2TreeNode, IResourceRef} from '../hl7-v2-tree/hl7-v2-tree.component';
@Component({
  selector: 'app-slicing-row',
  templateUrl: './slicing-row.component.html',
  styleUrls: ['./slicing-row.component.css'],
})
export class SlicingRowComponent<T extends ISlice> implements OnInit {

  nodes: IHL7v2TreeNode[];
  show = true;
  nameDisplay: string;
  sliceRow_: ISlicing;
  resource$: Observable<IResource>;
  node$: Observable<IHL7v2TreeNode>;
  node: IHL7v2TreeNode;
  display$: Observable<IDisplayElement>;
  position: string;
  repository: StoreResourceRepositoryService;

  resources: IDisplayElement[];
  @Output()
  change: EventEmitter<IChange> = new EventEmitter<IChange>();
  map: IDisyplayMap = {};
  available_: IDisplayElement[] = [];
  @Input()
  viewOnly: boolean;

  @Input()
  set sliceParams(event: {repo: StoreResourceRepositoryService, nodes: IHL7v2TreeNode[], sliceRow: ISlicing, resources: IDisplayElement[], parent: IResource}) {
    this.sliceRow_ = event.sliceRow;
    this.nodes = event.nodes;
    this.resources = event.resources;
    this.repository = event.repo;
    if ( this.sliceRow_ != null) {
      const path: IPath = this.pathService.getPathFromPathId(event.parent.id + '-' + this.sliceRow_.path);
      this.node$ = this.getNodeByPath(path);
      this.resource$ = this.getNodeResource(path);
      const path_without_parent = this.pathService.trimPathRoot(path);
      this.elementNamingService.getPathInfoFromPath(event.parent,  this.repository, path_without_parent).subscribe((x) => {
        this.position = this.elementNamingService.getPositionalPath(x).substr(3);
        },
      );
      this.node$.subscribe((x) => {
        this.node = x;
        this.nameDisplay = this.node.data.name;
      });
      this.display$ = this.getDisplay(path).pipe(take(1));
      this.display$.subscribe((x) => {
        this.available_ = [...this.resources.filter((elm) => x.fixedName === elm.fixedName )];
        this.map = _.keyBy(this.available_, (o) => o.id);
      });
    }
  }

  ngOnInit(): void {
  }
  constructor(
    private slicingService: SlicingService,
    public hl7V2TreeService: Hl7V2TreeService,
    private dialog: MatDialog,
    private elementNamingService: ElementNamingService,
    private pathService: PathService,
  ) {

  }

  addAssertion(slice: IConditionalSlice) {
    const dialogRef = this.dialog.open(CsDialogComponent, {
      maxWidth: '150vw',
      maxHeight: '130vh',
      data: {
        title: 'Slicing Condition',
        assertionMode: true,
        assertion: slice.assertion,
        resource:  this.resource$,
        excludePaths: [],
      },
    });
    dialogRef.afterClosed().pipe( filter((x) => x !== undefined),
      take(1),
      tap((res) => {
        slice.assertion = res.assertion;
        this.emitRow(ChangeType.UPDATE);
      })).subscribe();

  }
  getNodeResource(path: IPath): Observable<IResource> {
    return this.hl7V2TreeService.getNodeByPath(this.nodes, path, this.repository).pipe(
      mergeMap((node) => {
        const ref: IResourceRef = node.data.ref.getValue();
        return this.repository.fetchResource(ref.type, ref.id);
      }));
  }

  addSlice() {
    if ( this.sliceRow_.type === ISlicingMethodType.ASSERTION) {
      const conditionalSlice:  IConditionalSlice  = { comments: '', flavorId: null, assertion: null};
      this.sliceRow_.slices.push(conditionalSlice);
    } else if ( this.sliceRow_.type === ISlicingMethodType.OCCURRENCE) {
      const conditionalSlice:  IOrderedSlice  = { comments: '', flavorId: null, position: this.sliceRow_.slices.length + 1};
      this.sliceRow_.slices.push(conditionalSlice);
    }
    this.emitRow(ChangeType.UPDATE);
  }
  getDisplay(path: IPath): Observable<IDisplayElement> {
    return this.hl7V2TreeService.getNodeByPath(this.nodes, path, this.repository).pipe(
      take(1),
      mergeMap((node) => {
        const ref: IResourceRef = node.data.ref.getValue();
        return this.repository.getResourceDisplay(ref.type, ref.id);
      }));
  }

  getNodeByPath(path: IPath): Observable<IHL7v2TreeNode> {
    return this.hl7V2TreeService.getNodeByPath(this.nodes, path, this.repository);
  }

  modelChange($event: any, slice: ISlice) {
    slice.flavorId = $event.id;
    this.emitRow(ChangeType.UPDATE);
  }

  emitRow(changeType: ChangeType) {
    this.change.emit({
      changeType,
      propertyType: PropertyType.SLICING,
      propertyValue: this.sliceRow_,
      location: this.sliceRow_.path,
    });
  }

  toggleShow() {
    this.show = !this.show;
  }

  delete() {
    this.emitRow(ChangeType.DELETE);
  }

  update() {
   this.emitRow(ChangeType.UPDATE);
  }

  deleteSlice(i: number) {
    this.sliceRow_.slices.splice(i, 1);
    this.emitRow(ChangeType.UPDATE);
  }

  drop(event: CdkDragDrop<any>) {
    moveItemInArray(this.sliceRow_.slices, event.previousIndex, event.currentIndex);
    this.emitRow(ChangeType.UPDATE);
  }
}
export interface IDisyplayMap {
  [ id: string ]: IDisplayElement;
}
