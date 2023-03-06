import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { flatMap, map, take, tap } from 'rxjs/operators';
import { IUsageOption } from 'src/app/modules/shared/components/hl7-v2-tree/columns/usage/usage.component';
import { IHL7v2TreeNode, IResourceRef } from 'src/app/modules/shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { LengthType } from 'src/app/modules/shared/constants/length-type.enum';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import { Usage } from 'src/app/modules/shared/constants/usage.enum';
import { IDocumentRef } from 'src/app/modules/shared/models/abstract-domain.interface';
import { Hl7Config, IValueSetBindingConfigMap } from 'src/app/modules/shared/models/config.class';
import { IGroup, ISegmentRef } from 'src/app/modules/shared/models/conformance-profile.interface';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { IResource } from 'src/app/modules/shared/models/resource.interface';
import { IField, ISegment } from 'src/app/modules/shared/models/segment.interface';
import { IStructureElement } from 'src/app/modules/shared/models/structure-element.interface';
import { Hl7V2TreeService } from 'src/app/modules/shared/services/hl7-v2-tree.service';
import { AResourceRepositoryService } from 'src/app/modules/shared/services/resource-repository.service';
import { IStructCreateDialogResult } from 'src/app/modules/shared/services/struct-create-dialog.abstract';
import { IBindingContext } from 'src/app/modules/shared/services/structure-element-binding.service';
import { IMessageStructure, IMsgStructElement } from '../../../shared/models/conformance-profile.interface';
import { ChangeType, IChange, PropertyType } from '../../../shared/models/save-change';
import { StructureEditorService } from '../../services/structure-editor.service';
import { FieldAddDialogComponent } from '../field-add-dialog/field-add-dialog.component';
import { FieldImportDialogComponent } from '../field-import-dialog/field-import-dialog.component';
import { GroupAddDialogComponent } from '../group-add-dialog/group-add-dialog.component';
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
  Format = 'Format',
}

export type ColumnOptions = Array<{
  field: string,
  header: HL7v2TreeColumnType,
}>;

@Component({
  selector: 'app-hl7-v2-tree-structure',
  templateUrl: './hl7-v2-tree-structure.component.html',
  styleUrls: ['./hl7-v2-tree-structure.component.scss'],
})
export class Hl7V2TreeStructureComponent implements OnInit, OnDestroy {

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
  set config(conf: Hl7Config) {
    this._config = conf;
    this.usageOptions = Hl7Config.getUsageOptions(conf.usages, false, false, false).filter((u) => u.value !== Usage.CAB);
  }

  get config() {
    return this._config;
  }
  resource$: Observable<IResource>;
  treeExpandedNodes: string[];
  resourceName: string;
  _resource: IResource;
  _config: Hl7Config;

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
      case Type.MESSAGESTRUCT:
        this.context = { resource: Type.CONFORMANCEPROFILE };
        break;
    }
  }

  get resource() {
    return this._resource;
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
  @Output()
  structureChange: EventEmitter<IResource>;
  type: Type;
  nodes: IHL7v2TreeNode[];
  cols: ColumnOptions;
  selectedColumns: ColumnOptions;
  s_resource: Subscription;
  context: IBindingContext;
  treeSubscriptions: Subscription[];
  nodeType = this.treeService.nodeType;
  usageOptions: IUsageOption[];

  readonly trackBy = (index, item) => {
    return item.node.data.id;
  }

  constructor(
    private dialog: MatDialog,
    private structureService: StructureEditorService,
    private treeService: Hl7V2TreeService) {
    this.nodes = [];
    this.treeSubscriptions = [];
    this.treeExpandedNodes = [];
    this.changes = new EventEmitter<IChange>();
    this.structureChange = new EventEmitter<IResource>();
    this.changes$ = this.changes.asObservable();
  }

  propagatePositionAndId(structure: IStructureElement[], parentId: string, at: number, desc: boolean = false) {
    structure.filter((elm) => elm.position >= at).forEach((elm) => {
      desc ? elm.position-- : elm.position++;
      elm.id = parentId ? parentId + '.' + elm.position : elm.position + '';
      if (elm.type === Type.GROUP) {
        this.propagateId((elm as IGroup).children, elm.id);
      }
    });
  }

  propagateId(structure: IStructureElement[], parentId: string) {
    structure.forEach((elm) => {
      elm.id = parentId ? parentId + '.' + elm.position : elm.position + '';
      if (elm.type === Type.GROUP) {
        this.propagateId((elm as IGroup).children, elm.id);
      }
    });
  }

  addStructureElement<T>(
    path: string,
    type: Type,
    openDialog: () => Observable<IStructCreateDialogResult<T>>,
    parent?: IHL7v2TreeNode) {
    return openDialog().pipe(
      flatMap((result) => {
        if (result) {
          return (type === Type.GROUP ? of({}) : combineLatest(
            this.repository.fetchResource(result.resource.type, result.resource.id),
            this.loadResourceValueSetInfo(result.resource.type, result.resource.id),
          )).pipe(
            take(1),
            tap(() => {
              this.handleStructAdd<T>(path, type, result, parent);
            }),
          );
        } else {
          return of();
        }
      }),
    );
  }

  handleStructAdd<T>(
    path: string,
    type: Type,
    result: IStructCreateDialogResult<T>,
    parent?: IHL7v2TreeNode) {
    if (parent) {
      parent.expanded = true;
    }

    if (type === Type.SEGMENTREF || type === Type.GROUP) {
      this.addElmToMessage(this._resource as IMessageStructure, result.structElm as any, path);
    } else {
      this.addFieldToSegment(this._resource as ISegment, result.structElm as any);
    }
    this.resource = this._resource;
  }

  addField(path: string, nodes: IHL7v2TreeNode[], parent?: IHL7v2TreeNode) {
    this.addStructureElement<IField>(
      path,
      Type.FIELD,
      () => {
        return this.dialog.open(FieldAddDialogComponent, {
          data: {
            parent,
            resources: this.datatypes,
            position: nodes.length + 1,
            root: this.resourceName,
            type: this.type,
            path: parent ? parent.data.id : undefined,
            size: nodes.length,
            usages: this.usageOptions,
          },
        }).afterClosed();
      },
      parent,
    ).subscribe();
  }

  importField(path: string, nodes: IHL7v2TreeNode[], parent?: IHL7v2TreeNode) {
    this.addStructureElement<IField>(
      path,
      Type.FIELD,
      () => {
        return this.dialog.open(FieldImportDialogComponent, {
          data: {
            parent,
            resources: this.datatypes,
            position: nodes.length + 1,
            root: this.resourceName,
            type: this.type,
            path: parent ? parent.data.id : undefined,
            size: nodes.length,
            usages: this.usageOptions,
          },
        }).afterClosed();
      },
      parent,
    ).subscribe();
  }

  addSegment(path: string, nodes: IHL7v2TreeNode[], parent?: IHL7v2TreeNode) {
    this.addStructureElement<ISegmentRef>(
      path,
      Type.SEGMENTREF,
      () => {
        return this.dialog.open(SegmentAddDialogComponent, {
          data: {
            parent,
            resources: this.segments,
            position: nodes.length + 1,
            root: parent ? parent.data.name : 'Message Structure',
            type: parent ? parent.data.type : Type.MESSAGESTRUCT,
            path: parent ? parent.data.id : undefined,
            size: nodes.length,
            usages: this.usageOptions,
          },
        }).afterClosed();
      },
      parent,
    ).subscribe();
  }

  addGroup(path: string, nodes: IHL7v2TreeNode[], parent?: IHL7v2TreeNode) {
    this.addStructureElement<IGroup>(
      path,
      Type.GROUP,
      () => {
        return this.dialog.open(GroupAddDialogComponent, {
          data: {
            parent,
            resources: this.segments,
            position: nodes.length + 1,
            root: parent ? parent.data.name : 'Message Structure',
            type: parent ? parent.data.type : Type.MESSAGESTRUCT,
            path: parent ? parent.data.id : undefined,
            size: nodes.length,
            usages: this.usageOptions,
          },
        }).afterClosed();
      },
      parent,
    ).subscribe();
  }

  addToNode(row, type: Type) {
    if (type === Type.SEGMENTREF) {
      this.addSegment(row.node.data.pathId, row.node.children, row.node);
    } else if (type === Type.GROUP) {
      this.addGroup(row.node.data.pathId, row.node.children, row.node);
    }
  }

  removeNode(node: IHL7v2TreeNode) {
    if (this.type === Type.SEGMENT) {
      this.removeFieldFromSegment(this._resource as ISegment, node);
    } else if (this.type === Type.MESSAGESTRUCT) {
      this.removeElmFromMessage(this._resource as IMessageStructure, node, node.parent ? node.parent.data.pathId : '');
    }
  }

  addFieldToSegment(segment: ISegment, field: IField) {
    this.propagatePositionAndId(segment.children, undefined, field.position);
    segment.children.push(field);
    this.registerChange({
      changeType: ChangeType.ADD,
      propertyType: PropertyType.FIELD,
      location: '',
      propertyValue: field,
    });
  }

  addElmToMessage(message: IMessageStructure, structElm: IMsgStructElement, location: string) {
    const { pathId, container } = this.getTargetContainerAndId(message, location);
    this.propagatePositionAndId(container, pathId, structElm.position);
    container.push(structElm);
    this.registerChange({
      changeType: ChangeType.ADD,
      propertyType: PropertyType.STRUCTSEGMENT,
      location,
      propertyValue: structElm,
    });
  }

  removeFieldFromSegment(segment: ISegment, node: IHL7v2TreeNode) {
    const targetId = segment.children.findIndex((elm) => elm.id === node.data.id);
    segment.children.splice(targetId, 1);
    this.propagatePositionAndId(segment.children, '', node.data.position + 1, true);
    this.resource = segment;
    this.registerChange({
      changeType: ChangeType.DELETE,
      propertyType: PropertyType.FIELD,
      location: '',
      propertyValue: undefined,
    });
  }

  removeElmFromMessage(message: IMessageStructure, node: IHL7v2TreeNode, location: string) {
    const { pathId, container } = this.getTargetContainerAndId(message, location);
    const targetId = container.findIndex((elm) => elm.id === node.data.id);
    container.splice(targetId, 1);
    this.propagatePositionAndId(container, pathId, node.data.position + 1, true);
    this.resource = message;
    this.registerChange({
      changeType: ChangeType.DELETE,
      propertyType: PropertyType.STRUCTSEGMENT,
      location: '',
      propertyValue: undefined,
    });
  }

  getTargetContainerAndId(message: IMessageStructure, location: string): { pathId: string; container: IStructureElement[] } {
    const parts = location !== '' ? location.split('-') : [];
    let parentId;
    let cursor = message.children;

    for (const part of parts) {
      const elm = cursor.find((e) => e.id === part);
      if (elm && elm.type === Type.GROUP) {
        parentId = elm.id;
        cursor = (elm as IGroup).children;
      } else {
        throw new Error('Invalid Location');
      }
    }

    return { pathId: parentId, container: cursor };
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
    this.structureChange.emit(this._resource);
  }

  datatypeChange(change: IChange, row: { node: IHL7v2TreeNode }) {
    this.referenceChange(change.propertyValue, row.node, change);
  }

  segmentChange(change: IChange, row: { node: IHL7v2TreeNode }) {
    this.referenceChange(change.propertyValue, row.node, change);
  }

  referenceChange(ref: IResourceRef, node: IHL7v2TreeNode, change: IChange) {
    this.loadResourceValueSetInfo(ref.type, ref.id).pipe(
      map(() => {
        node.data.ref.next(ref);
        this.resolveReference(node);
        this.registerChange({
          ...change,
          propertyValue: change.propertyValue.id,
          oldPropertyValue: change.oldPropertyValue.id,
        });
      }),
    ).subscribe();
  }

  loadResourceValueSetInfo(type: Type, id: string): Observable<IDisplayElement[]> {
    return this.structureService.getResourceValueSets(type, id).pipe(
      flatMap((valueSets) => {
        return this.repository.hotplugDisplayList(valueSets, Type.VALUESET);
      }),
    );
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
