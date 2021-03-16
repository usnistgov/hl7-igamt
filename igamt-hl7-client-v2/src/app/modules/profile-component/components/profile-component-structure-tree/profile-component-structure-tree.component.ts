import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';
import { Observable, Subscription, BehaviorSubject, combineLatest } from 'rxjs';
import {
  ColumnOptions,
  HL7v2TreeColumnType,
  IHL7v2TreeNode, IResourceRef,
} from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { LengthType } from '../../../shared/constants/length-type.enum';
import { Type } from '../../../shared/constants/type.enum';
import { IDocumentRef } from '../../../shared/models/abstract-domain.interface';
import { Hl7Config, IValueSetBindingConfigMap } from '../../../shared/models/config.class';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IProfileComponentContext } from '../../../shared/models/profile.component';
import { IResource } from '../../../shared/models/resource.interface';
import { IChange } from '../../../shared/models/save-change';
import { AResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { IBindingContext } from '../../../shared/services/structure-element-binding.service';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-profile-component-structure-tree',
  templateUrl: './profile-component-structure-tree.component.html',
  styleUrls: ['./profile-component-structure-tree.component.css'],
})
export class ProfileComponentStructureTreeComponent implements OnInit, OnDestroy {

  columnTypes = HL7v2TreeColumnType;
  types = Type;
  @Input()
  documentRef: IDocumentRef;
  @Input()
  viewOnly: boolean;
  @Input()
  derived: boolean;
  @Input()
  datatypes: IDisplayElement[];
  @Input()
  segments: IDisplayElement[];
  @Input()
  valueSets: IDisplayElement[];
  @Input()
  bindingConfig: IValueSetBindingConfigMap;
  @Input()
  repository: AResourceRepositoryService;
  @Input()
  username: string;
  @Input()
  config: Hl7Config;
  treeExpandedNodes: string[];

  resource$: BehaviorSubject<IResource>;
  profileComponentContext$: BehaviorSubject<IProfileComponentContext>;

  @Input()
  set resource(resource: IResource) {
    this.resource$.next(resource);
  }

  @Input()
  set profileComponentContext(profileComponentContext: IProfileComponentContext) {
    this.profileComponentContext$.next(profileComponentContext);
  }

  @Input()
  set columns(cols: HL7v2TreeColumnType[]) {
    this.cols = cols.map((col) => {
      return {
        field: col,
        header: col,
      };
    });
    this.selectedColumns = [...this.cols];
  }
  @Output()
  changes: EventEmitter<IChange>;
  changes$: Observable<IChange>;
  type: Type;
  nodes: IHL7v2TreeNode[];
  cols: ColumnOptions;
  selectedColumns: ColumnOptions;
  s_resource: Subscription;
  context: IBindingContext;
  treeSubscriptions: Subscription[];

  readonly trackBy = (index, item) => {
    return item.node.data.id;
  }

  constructor(
    private dialog: MatDialog
  ) {
    this.nodes = [];
    this.treeSubscriptions = [];
    this.treeExpandedNodes = [];
    this.changes = new EventEmitter<IChange>();
    this.changes$ = this.changes.asObservable();
    combineLatest(
      this.resource$,
      this.profileComponentContext$,
    ).pipe(
      filter(([r, p]) => !!r && !!p),
      map(([resource, context]) => {

      })
    )
  }

  datatypeChange(change: IChange, row: { node: IHL7v2TreeNode }) {
    this.referenceChange(change.propertyValue, row.node, change);
  }

  segmentChange(change: IChange, row: { node: IHL7v2TreeNode }) {
    this.referenceChange(change.propertyValue, row.node, change);
  }

  referenceChange(ref: IResourceRef, node: IHL7v2TreeNode, change: IChange) {
    node.data.ref.next(ref);
    // this.registerChange({
    //   ...change,
    //   propertyValue: change.propertyValue.id,
    //   oldPropertyValue: change.oldPropertyValue.id,
    // });
  }

  updateLength(value: LengthType, row: { node: IHL7v2TreeNode }) {
    row.node.data.lengthType = value;
  }

  onNodeExpand(event) {
    if (!this.treeExpandedNodes.includes(event.node.data.pathId)) {
      this.treeExpandedNodes.push(event.node.data.pathId);
    }
    this.nodes = [...this.nodes];

  }

  onNodeCollapse(event) {
    const index = this.treeExpandedNodes.indexOf(event.node.data.pathId);
    if (index !== -1) {
      this.treeExpandedNodes.splice(index, 1);
    }
  }

  ngOnDestroy() {
    // this.close(this.s_resource);
    // for (const sub of this.treeSubscriptions) {
    //   this.close(sub);
    // }
  }

  ngOnInit() {
  }
}
