import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';
import { TreeNode } from 'primeng/primeng';
import { BehaviorSubject, Observable, of, Subject, Subscription } from 'rxjs';
import { LengthType } from '../../constants/length-type.enum';
import { Type } from '../../constants/type.enum';
import { Usage } from '../../constants/usage.enum';
import { IDocumentRef } from '../../models/abstract-domain.interface';
import { IComment } from '../../models/comment.interface';
import { Hl7Config, IValueSetBindingConfigMap } from '../../models/config.class';
import { IPath } from '../../models/cs.interface';
import { IDisplayElement } from '../../models/display-element.interface';
import { IPredicate } from '../../models/predicate.interface';
import { IResource } from '../../models/resource.interface';
import { IChange, ILocationChangeLog, PropertyType } from '../../models/save-change';
import { ISlicing } from '../../models/slicing';
import { Hl7V2TreeService } from '../../services/hl7-v2-tree.service';
import { AResourceRepositoryService } from '../../services/resource-repository.service';
import { IBindingContext, IElementBinding } from '../../services/structure-element-binding.service';
import { IBindingLocationInfo } from '../binding-selector/binding-selector.component';
import { IUserConfig } from './../../models/config.class';
import { IItemProperty } from '../../models/profile.component';

export enum HL7v2TreeColumnType {
  USAGE = 'Usage',
  OLDUSAGE = 'Old Usage',
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
  PATH = 'Path',
  Format = 'Format',
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

export interface IHL7v2TreeNodeData {
  id: string;
  name: string;
  position: number;
  type: Type;
  usage?: IStringValue;
  oldUsage?: Usage;
  text?: IStringValue;
  cardinality?: ICardinalityRange;
  length?: ILengthRange;
  comments?: IComment[];
  constantValue?: IStringValue;
  lengthType?: LengthType;
  pathId: string;
  changeable?: boolean;
  viewOnly?: boolean;
  confLength?: string;
  valueSetBindingsInfo?: BehaviorSubject<IBindingLocationInfo>;
  ref?: BehaviorSubject<IResourceRef>;
  bindings?: IElementBinding;
  level?: number;
  custom?: boolean;
  changeLog?: ILocationChangeLog;
  rootPath: IPath;
  slicing?: ISlicing;
  resourcePathId?: string;
  profileComponentOverrides?: BehaviorSubject<Partial<Record<PropertyType, IItemProperty>>>;
}

export interface IHL7v2TreeNode extends TreeNode {
  data: IHL7v2TreeNodeData;
  parent?: IHL7v2TreeNode;
  children?: IHL7v2TreeNode[];
  $hl7V2TreeHelpers?: {
    predicate$?: Observable<IPredicate>;
    ref$: Observable<IResourceRef>;
    treeChildrenSubscription: Subscription;
    children$: Subject<IHL7v2TreeNode[]>;
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
  @Input()
  userConfig: IUserConfig;
  resource$: Observable<IResource>;
  treeExpandedNodes: string[];
  resourceName: string;
  _resource: IResource;

  @Input()
  set resource(resource: IResource) {
    this._resource = _.cloneDeep(resource);
    this.type = this._resource.type;
    this.resourceName = this._resource.name;
    this.resource$ = of(this._resource);
    this.close(this.s_resource);
    this.s_resource = this.treeService.getTree(this._resource, this.repository, this.viewOnly, true, (value) => {
      this.nodes = [...value];
      this.recoverExpandState(this.nodes, this.treeExpandedNodes);
    });
    switch (this._resource.type) {
      case Type.DATATYPE:
        this.context = { resource: Type.DATATYPE };
        break;
      case Type.SEGMENT:
        this.context = { resource: Type.SEGMENT };
        break;
      case Type.CONFORMANCEPROFILE:
        this.context = { resource: Type.CONFORMANCEPROFILE };
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

  nodeType(node: IHL7v2TreeNode): Type {
    return this.treeService.nodeType(node);
  }
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

  datatypeChange(change: IChange, row: { node: IHL7v2TreeNode }) {
    if (this.capture(change, PropertyType.DATATYPE)) {
      this.referenceChange(change.propertyValue, row.node, change);
    }
  }

  segmentChange(change: IChange, row: { node: IHL7v2TreeNode }) {
    if (this.capture(change, PropertyType.SEGMENTREF)) {
      this.referenceChange(change.propertyValue, row.node, change);
    }
  }

  capture(change: IChange, property: PropertyType): boolean {
    if (change.propertyType === property) {
      return true;
    } else {
      this.registerChange(change);
      return false;
    }
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
    const subscription = this.treeService.resolveReference(node, this.repository, {
      viewOnly: this.viewOnly,
      then: () => {
        this.nodes = [...this.nodes];
      },
      transform: (children: IHL7v2TreeNode[]) => {
        this.recoverExpandState(children, expanded);
        return of(children);
      },
      useProfileComponentRef: true,
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
