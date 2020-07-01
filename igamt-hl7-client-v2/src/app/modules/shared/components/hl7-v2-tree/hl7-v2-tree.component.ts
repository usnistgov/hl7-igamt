import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TreeNode } from 'primeng/primeng';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { LengthType } from '../../constants/length-type.enum';
import { Type } from '../../constants/type.enum';
import { Usage } from '../../constants/usage.enum';
import { IDocumentRef } from '../../models/abstract-domain.interface';
import { IComment } from '../../models/comment.interface';
import { Hl7Config, IValueSetBindingConfigMap } from '../../models/config.class';
import { IDisplayElement } from '../../models/display-element.interface';
import { IPredicate } from '../../models/predicate.interface';
import { IResource } from '../../models/resource.interface';
import { ChangeType, IChange, PropertyType } from '../../models/save-change';
import { IField } from '../../models/segment.interface';
import { Hl7V2TreeService, IBindingContext, IElementBinding } from '../../services/hl7-v2-tree.service';
import { AResourceRepositoryService } from '../../services/resource-repository.service';
import { IStructCreateDialogResult } from '../../services/struct-create-dialog.abstract';
import { IBindingLocationInfo } from '../binding-selector/binding-selector.component';
import { FieldAddDialogComponent } from '../field-add-dialog/field-add-dialog.component';
import { SegmentAddDialogComponent } from '../segment-add-dialog/segment-add-dialog.component';

export enum HL7v2TreeColumnType {
  USAGE = 'Usage',
  NAME = 'Name',
  CARDINALITY = 'Cardinality',
  LENGTH = 'Length',
  CONFLENGTH = 'Conformance Length',
  SEGMENT = 'Segment',
  DATATYPE = 'Datatype',
  VALUESET = 'ValueSet',
  COMMENT = 'Comment',
  TEXT = 'Definition Text',
  CONSTANTVALUE = 'Constant Value',
}

export interface ILengthRange {
  min: string;
  max: string;
}

export interface ICardinalityRange {
  min: number;
  max: string;
}

export interface IResourceRef {
  type: Type;
  id: string;
  version: string;
  name: string;
}

export interface IResourceKey {
  type: Type;
  id: string;
}

export interface IStringValue {
  value: string;
}

export interface IHL7v2TreeNode extends TreeNode {
  data: {
    id: string,
    name: string,
    position: number,
    type: Type,
    usage?: IStringValue,
    oldUsage?: Usage,
    text?: IStringValue,
    cardinality?: ICardinalityRange,
    length?: ILengthRange,
    comments?: IComment[],
    constantValue?: IStringValue,
    lengthType?: LengthType,
    pathId: string,
    changeable?: boolean,
    viewOnly?: boolean,
    confLength?: string,
    valueSetBindingsInfo?: Observable<IBindingLocationInfo>,
    ref?: BehaviorSubject<IResourceRef>,
    bindings?: IElementBinding,
    level?: number,
    custom?: boolean,
  };
  parent?: IHL7v2TreeNode;
  children?: IHL7v2TreeNode[];
  $hl7V2TreeHelpers?: {
    predicate$?: Observable<IPredicate>;
    ref$: Observable<IResourceRef>;
    treeChildrenSubscription: Subscription;
  };
}

export type ColumnOptions = Array<{
  field: string,
  header: HL7v2TreeColumnType,
}>;

@Component({
  selector: 'app-hl7-v2-tree',
  templateUrl: './hl7-v2-tree.component.html',
  styleUrls: ['./hl7-v2-tree.component.scss'],
})
export class Hl7V2TreeComponent implements OnInit, OnDestroy {

  columnTypes = HL7v2TreeColumnType;
  types = Type;
  @Input()
  documentRef: IDocumentRef;
  @Input()
  viewOnly: boolean;
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
  resource$: Observable<IResource>;
  treeExpandedNodes: string[];
  resourceName: string;
  _resource: IResource;
  structChangeType: PropertyType.STRUCTSEGMENT | PropertyType.FIELD;

  @Input()
  set resource(resource: IResource) {
    this.type = resource.type;
    this.resourceName = resource.name;
    this._resource = resource;
    this.resource$ = of(resource);
    this.close(this.s_resource);
    this.s_resource = this.treeService.getTree(resource, this.repository, this.viewOnly, true, (value) => {
      this.nodes = [...value];
      this.recoverExpandState(this.nodes, this.treeExpandedNodes);
    });
    switch (resource.type) {
      case Type.DATATYPE:
        this.context = { resource: Type.DATATYPE };
        break;
      case Type.SEGMENT:
        this.context = { resource: Type.SEGMENT };
        this.structChangeType = PropertyType.FIELD;
        break;
      case Type.CONFORMANCEPROFILE:
        this.context = { resource: Type.CONFORMANCEPROFILE };
        this.structChangeType = PropertyType.STRUCTSEGMENT;
        break;
    }
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
  nodeType = this.treeService.nodeType;

  readonly trackBy = (index, item) => {
    return item.node.data.id;
  }

  constructor(
    private dialog: MatDialog,
    private treeService: Hl7V2TreeService) {
    this.nodes = [];
    this.treeSubscriptions = [];
    this.treeExpandedNodes = [];
    this.changes = new EventEmitter<IChange>();
    this.changes$ = this.changes.asObservable();
  }

  addChild<T>(
    path: string,
    nodes: IHL7v2TreeNode[],
    openDialog: () => Observable<IStructCreateDialogResult<T>>,
    parent?: IHL7v2TreeNode) {
    return openDialog().pipe(
      map((result) => {
        if (result) {
          nodes.push(result.node);
          if (parent) {
            parent.expanded = true;
          }
          this.nodes = [...this.nodes];
          this.addStructElm(path, this.structChangeType, result.structElm, result.node.data.position);
        }
      }),
    );
  }

  addField(path: string, nodes: IHL7v2TreeNode[], parent?: IHL7v2TreeNode) {
    this.addChild<IField>(
      path,
      nodes,
      () => {
        return this.dialog.open(FieldAddDialogComponent, {
          data: {
            parent,
            resources: this.datatypes,
            position: nodes.length + 1,
            root: this.resourceName,
            type: this.type,
            path,
            usages: Hl7Config.getUsageOptions(this.config.usages, false, false),
          },
        }).afterClosed();
      },
      parent,
    ).subscribe();
  }

  addSegment(path: string, nodes: IHL7v2TreeNode[], parent?: IHL7v2TreeNode) {
    this.addChild<IField>(
      path,
      nodes,
      () => {
        return this.dialog.open(SegmentAddDialogComponent, {
          data: {
            parent,
            resources: this.segments,
            position: nodes.length + 1,
            root: this.resourceName,
            type: this.type,
            path,
            usages: Hl7Config.getUsageOptions(this.config.usages, false, false),
          },
        }).afterClosed();
      },
      parent,
    ).subscribe();
  }

  canDeleteNode(node: IHL7v2TreeNode) {
    if (node.parent) {
      return node.data.position === node.parent.children.length;
    } else {
      return node.data.position === this.nodes.length;
    }
  }

  addToNode(row) {
    this.addSegment(row.node.data.pathId, row.node.children, row.node);
  }

  removeNode(node: IHL7v2TreeNode) {
    const target = node.parent ? node.parent.children : this.nodes;
    target.splice(node.data.position - 1, 1);
    this.nodes = [
      ...this.nodes,
    ];
    this.removeStructElm(node.parent ? node.parent.data.pathId : '', this.structChangeType, this.treeService.nodeToSegmentRef(node), node.data.position);
  }

  close(s: Subscription) {
    if (s && !s.closed) {
      s.unsubscribe();
    }
  }

  refreshTree() {
    this.nodes = [...this.nodes];
  }

  recoverExpandState(tree: IHL7v2TreeNode[], expanded: string[]) {
    if (expanded && expanded.length > 0) {
      tree.forEach((node) => {
        if (this.treeExpandedNodes.includes(node.data.pathId)) {
          node.expanded = true;
          this.resolveReference(node, expanded.filter((x) => x.startsWith(node.data.pathId)));
        }
        if (node.children) {
          this.recoverExpandState(node.children, expanded.filter((x) => x.startsWith(node.data.pathId)));
        }
      });
    }
  }

  registerChange(change: IChange) {
    this.changes.emit(change);
  }

  addStructElm<T>(location: string, type: PropertyType.STRUCTSEGMENT | PropertyType.FIELD, elm: T, position: number) {
    const change: IChange = {
      location,
      propertyType: type,
      propertyValue: elm,
      oldPropertyValue: null,
      position,
      changeType: ChangeType.ADD,
    };
    this.registerChange(change);
  }

  removeStructElm<T>(location: string, type: PropertyType.STRUCTSEGMENT | PropertyType.FIELD, elm: T, position: number) {
    const change: IChange = {
      location,
      propertyType: type,
      oldPropertyValue: null,
      propertyValue: elm,
      position,
      changeType: ChangeType.DELETE,
    };
    this.registerChange(change);
  }

  datatypeChange(change: IChange, row: { node: IHL7v2TreeNode }) {
    this.referenceChange(change.propertyValue, row.node, change);
  }

  segmentChange(change: IChange, row: { node: IHL7v2TreeNode }) {
    this.referenceChange(change.propertyValue, row.node, change);
  }

  referenceChange(ref: IResourceRef, node: IHL7v2TreeNode, change: IChange) {
    node.data.ref.next(ref);
    this.resolveReference(node);
    this.registerChange({
      ...change,
      propertyValue: change.propertyValue.id,
      oldPropertyValue: change.oldPropertyValue.id,
    });
  }

  updateLength(value: LengthType, row: { node: IHL7v2TreeNode }) {
    row.node.data.lengthType = value;
  }

  onNodeExpand(event) {
    if (!this.treeExpandedNodes.includes(event.node.data.pathId)) {
      this.treeExpandedNodes.push(event.node.data.pathId);
    }
    this.resolveReference(event.node);
  }

  onNodeCollapse(event) {
    const index = this.treeExpandedNodes.indexOf(event.node.data.pathId);
    if (index !== -1) {
      this.treeExpandedNodes.splice(index, 1);
    }
  }

  resolveReference(node: IHL7v2TreeNode, expanded?: string[]) {
    const subscription = this.treeService.resolveReference(node, this.repository, this.viewOnly, () => {
      this.nodes = [...this.nodes];
    }, (children: IHL7v2TreeNode[]) => {
      this.recoverExpandState(children, expanded);
      return children;
    });
    if (subscription) {
      this.treeSubscriptions.push(subscription);
    }
  }

  ngOnDestroy() {
    this.close(this.s_resource);
    for (const sub of this.treeSubscriptions) {
      this.close(sub);
    }
  }

  ngOnInit() {
  }
}
