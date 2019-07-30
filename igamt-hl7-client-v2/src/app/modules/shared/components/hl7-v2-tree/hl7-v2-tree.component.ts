import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Type } from '../../constants/type.enum';
import { IComment } from '../../models/comment.interface';
import { IDisplayElement } from '../../models/display-element.interface';
import { IPredicate } from '../../models/predicate.interface';
import { IResource } from '../../models/resource.interface';
import { IChange } from '../../models/save-change';
import { Hl7V2TreeService, IBindingContext, IElementBinding } from '../../services/hl7-v2-tree.service';
import { AResourceRepositoryService } from '../../services/resource-repository.service';
import { ILengthAndConfLength } from './columns/length/length.component';

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
    usage: IStringValue,
    text: IStringValue,
    cardinality?: ICardinalityRange,
    length?: ILengthRange,
    comments?: IComment[],
    constantValue?: IStringValue,
    pathId: string,
    changeable?: boolean,
    viewOnly?: boolean,
    confLength?: string,
    ref: BehaviorSubject<IResourceRef>,
    bindings: IElementBinding,
    level: number,
  };
  parent?: IHL7v2TreeNode;
  children?: IHL7v2TreeNode[];
  $hl7V2TreeHelpers: {
    predicate$: Observable<IPredicate>;
    ref$: Observable<IResourceRef>;
    treeChildrenSubscription: Subscription;
  };
}

type ColumnOptions = Array<{
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
  viewOnly: boolean;
  @Input()
  datatypes: IDisplayElement[];
  @Input()
  segments: IDisplayElement[];
  @Input()
  repository: AResourceRepositoryService;
  @Input()
  username: string;

  @Input()
  set resource(resource: IResource) {
    this.type = resource.type;
    this.close(this.s_resource);
    console.log(resource);
    this.s_resource = this.treeService.getTree(resource, this.repository, this.viewOnly, true, (value) => {
      this.nodes = [...value];
    });
    switch (resource.type) {
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

  type: Type;
  nodes: TreeNode[];
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
    private treeService: Hl7V2TreeService) {
    this.nodes = [];
    this.treeSubscriptions = [];
    this.changes = new EventEmitter<IChange>();
  }

  close(s: Subscription) {
    if (s && !s.closed) {
      s.unsubscribe();
    }
  }

  refreshTree() {
    this.nodes = [...this.nodes];
  }

  registerChange(change: IChange) {
    this.changes.emit(change);
  }

  datatypeChange(change: IChange, row: { node: IHL7v2TreeNode }) {
    this.referenceChange({
      type: Type.DATATYPE,
      id: change.propertyValue,
    }, row.node, change);
  }

  segmentChange(change: IChange, row: { node: IHL7v2TreeNode }) {
    this.referenceChange({
      type: Type.SEGMENT,
      id: change.propertyValue,
    }, row.node, change);
  }

  referenceChange(ref: IResourceRef, node: IHL7v2TreeNode, change: IChange) {
    node.data.ref.next(ref);
    this.repository.fetchResource(ref.type, ref.id).subscribe();
    this.resolveReference(node);
    this.registerChange(change);
  }

  updateLength(value: ILengthAndConfLength, row: { node: IHL7v2TreeNode }) {
    row.node.data.length = value.length;
    row.node.data.confLength = value.confLength;
  }

  onNodeExpand(event) {
    this.resolveReference(event.node);
  }

  print(x) {
    console.log(x);
  }

  resolveReference(node: IHL7v2TreeNode) {
    const subscription = this.treeService.resolveReference(node, this.repository, this.viewOnly, () => {
      this.nodes = [...this.nodes];
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
