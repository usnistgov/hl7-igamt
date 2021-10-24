import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Actions} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import _ from 'lodash';
import {Observable} from 'rxjs';
import {filter, map, mergeMap, take, tap, withLatestFrom} from 'rxjs/operators';
import {selectAllDatatypes, selectAllSegments} from '../../../../root-store/dam-igamt/igamt.resource-display.selectors';
import {MessageService} from '../../../dam-framework/services/message.service';
import {Scope} from '../../constants/scope.enum';
import {IPath} from '../../models/cs.interface';
import {IDisplayElement} from '../../models/display-element.interface';
import {IResource} from '../../models/resource.interface';
import {IConditionalSlice, IOrderedSlice, ISlice, ISlicing, ISlicingMethodType} from '../../models/slicing';
import {Hl7V2TreeService} from '../../services/hl7-v2-tree.service';
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
  show: boolean = true;
  @Input()
  set sliceParams(event: any) {
    this.sliceRow_ = event.sliceRow;
    this.nodes = event.nodes;
    this.resources = event.resources;
    if ( this.sliceRow_ != null) {
      this.resource$ = this.getNodeResource(this.sliceRow_.path);
      this.node$ = this.getNodeByPath(this.sliceRow_.path);
      this.node$.subscribe((x) => {this.node = x; });
      this.display$ = this.getDisplay(this.sliceRow_.path).pipe(take(1));
      this.display$.subscribe((x) => {
        this.available_ = [...this.resources.filter((elm) => x.fixedName === elm.fixedName )];
        this.map = _.keyBy(this.available_, (o) => o.id);
      });
    }
  }
  sliceRow_: ISlicing;
  resource$: Observable<IResource>;
  node$: Observable<IHL7v2TreeNode>;
  node: IHL7v2TreeNode;
  display$: Observable<IDisplayElement>;
  @Input()
  resources: IDisplayElement[];
  map: IDisyplayMap = {};
  available_: IDisplayElement[] = [];

  ngOnInit(): void {
  }
  constructor(
    private slicingService: SlicingService,
    public hl7V2TreeService: Hl7V2TreeService,
    private dialog: MatDialog,
    private repository: StoreResourceRepositoryService,
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
      tap((res) => {
        slice.assertion = res.assertion;
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
      const conditionalSlice:  IConditionalSlice  = { comment: '', flavorId: null, assertion: null};
      this.sliceRow_.slices.push(conditionalSlice);
    } else if ( this.sliceRow_.type === ISlicingMethodType.OCCURENCE) {
      const conditionalSlice:  IOrderedSlice  = { comment: '', flavorId: null, position: this.sliceRow_.slices.length + 1};
      this.sliceRow_.slices.push(conditionalSlice);
    }
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
    //slice.flavorId = $event.value.id;
  }

  getAvailable() {

  }

  toggleShow() {
    this.show = !this.show;
  }
}
export interface IDisyplayMap {
  [ id: string ]: IDisplayElement;
}
