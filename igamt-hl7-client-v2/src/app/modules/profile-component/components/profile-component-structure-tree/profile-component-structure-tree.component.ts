import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import * as _ from 'lodash';
import {Observable, of, Subscription} from 'rxjs';
import {flatMap, map, take} from 'rxjs/operators';
import {FieldAddDialogComponent} from '../../../shared/components/field-add-dialog/field-add-dialog.component';
import {
  ColumnOptions,
  HL7v2TreeColumnType,
  IHL7v2TreeNode, IResourceRef,
} from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import {SegmentAddDialogComponent} from '../../../shared/components/segment-add-dialog/segment-add-dialog.component';
import {LengthType} from '../../../shared/constants/length-type.enum';
import {Type} from '../../../shared/constants/type.enum';
import {IDocumentRef} from '../../../shared/models/abstract-domain.interface';
import {Hl7Config, IValueSetBindingConfigMap} from '../../../shared/models/config.class';
import {IConformanceProfile, IGroup, ISegmentRef} from '../../../shared/models/conformance-profile.interface';
import {IDisplayElement} from '../../../shared/models/display-element.interface';
import {IResource} from '../../../shared/models/resource.interface';
import {ChangeType, IChange, PropertyType} from '../../../shared/models/save-change';
import {IField, IProfileComponentContext, ISegment} from '../../../shared/models/segment.interface';
import {AResourceRepositoryService} from '../../../shared/services/resource-repository.service';
import {IStructCreateDialogResult} from '../../../shared/services/struct-create-dialog.abstract';
import {IBindingContext} from '../../../shared/services/structure-element-binding.service';
import {PCTreeMode, PcTreeService} from '../../services/pc-tree.service';

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
  resource$: Observable<IResource>;
  treeExpandedNodes: string[];
  resourceName: string;
  _resource: IResource;
  _profileComponentContext: IProfileComponentContext;
  structChangeType: PropertyType.STRUCTSEGMENT | PropertyType.FIELD;

  @Input()
  set resource(resource: IResource) {
    this._resource = _.cloneDeep(resource);
    this.type = this._resource.type;
    this.resourceName = this._resource.name;
    this.resource$ = of(this._resource);
    this.close(this.s_resource);
    this.s_resource = this.treeService.getTree(this._resource, this._profileComponentContext, PCTreeMode.DISPLAY, this.repository, this.viewOnly, true, (value: IHL7v2TreeNode[]) => {
     console.log(value);
     this.nodes = [...value];
     this.recoverExpandState(this.nodes, this.treeExpandedNodes);
    });
  }
  @Input()
  set profileComponentContext(profileComponentContext: IProfileComponentContext) {
    this._profileComponentContext = _.cloneDeep(profileComponentContext);
    this.type = this._resource.type;
    this.resourceName = this._resource.name;
    this.resource$ = of(this._resource);
    this.close(this.s_resource);
    this.s_resource = this.treeService.getTree(this._resource, _.cloneDeep(this._profileComponentContext), PCTreeMode.DISPLAY, this.repository, this.viewOnly, true, (value: IHL7v2TreeNode[]) => {
      console.log(value);
      this.nodes = [...value];
      this.recoverExpandState(this.nodes, this.treeExpandedNodes);
    });
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
    private treeService: PcTreeService) {
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
      flatMap((result) => {
        if (result) {
          return this.repository.fetchResource(result.resource.type, result.resource.id).pipe(
            take(1),
            map((resource) => {
              if (parent) {
                parent.expanded = true;
              }

              if (this.structChangeType === PropertyType.STRUCTSEGMENT) {
                this.addSegmentRefToMessage(this._resource as IConformanceProfile, result.structElm as any, path);
              } else {
                this.addFieldToSegment(this._resource as ISegment, result.structElm as any);
              }
              this.resource = this._resource;
              this.addStructElm(path, this.structChangeType, result.structElm, (result.structElm as any).position);
            }),
          );
        } else {
          return of();
        }
      }),
    );
  }

  addFieldToSegment(segment: ISegment, field: IField) {
    segment.children.push(field);
  }
  hasChange( pathId: string, col: string) {
    for (const item of  this._profileComponentContext.profileComponentItems) {
      if (item.path === pathId && item.itemProperties) {
        for (const prop of item.itemProperties ) {
          if (prop.propertyKey.toString().toLowerCase() === col.toLowerCase()) {
            return true;
          }
        }
      }
    }
    return false;
  }
  addSegmentRefToMessage(message: IConformanceProfile, segmentRef: ISegmentRef, location: string) {
    const parts = location !== '' ? location.split('-') : [];
    let cursor = message.children;

    for (const part of parts) {
      const elm = cursor.find((e) => e.id === part);
      if (elm && elm.type === Type.GROUP) {
        cursor = (elm as IGroup).children;
      } else {
        throw new Error('Invalid Location');
      }
    }
    cursor.push(segmentRef);
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
    this.nodes = [...this.nodes];

  }

  onNodeCollapse(event) {
    const index = this.treeExpandedNodes.indexOf(event.node.data.pathId);
    if (index !== -1) {
      this.treeExpandedNodes.splice(index, 1);
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
