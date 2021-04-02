import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';
import {
  ColumnOptions,
  HL7v2TreeColumnType,
  IHL7v2TreeNodeData,
  IHL7v2TreeNode,
} from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../../../shared/constants/type.enum';
import { IDocumentRef } from '../../../shared/models/abstract-domain.interface';
import { Hl7Config, IValueSetBindingConfigMap } from '../../../shared/models/config.class';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IItemProperty, IProfileComponentItem, IPropertyBinding, IProfileComponentBinding } from '../../../shared/models/profile.component';
import { IChange, PropertyType } from '../../../shared/models/save-change';
import { AResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { IBindingContext } from '../../../shared/services/structure-element-binding.service';
import { IPathInfo } from 'src/app/modules/shared/services/element-naming.service';
import { IResource } from 'src/app/modules/shared/models/resource.interface';
import { ProfileComponentStructureTreeItemMap } from '../../services/profile-component-structure-tree-item-map.object';

export interface IHL7V2ProfileComponentItemNode {
  location: {
    pathId: string;
    name: string;
    positionalPath: string;
    pathInfo: IPathInfo;
  }
  data: IHL7v2TreeNodeData;
}

export interface IProfileComponentChange {
  property?: IItemProperty;
  unset?: boolean;
  path: string;
  type: PropertyType;
  target?: string;
  root?: boolean;
  binding?: boolean;
}

@Component({
  selector: 'app-profile-component-structure-tree',
  templateUrl: './profile-component-structure-tree.component.html',
  styleUrls: ['./profile-component-structure-tree.component.scss'],
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

  @Input()
  set value(value: { items: IProfileComponentItem[], bindings: IProfileComponentBinding }) {
    this.itemsList = new ProfileComponentStructureTreeItemMap(value.items || [], value.bindings);
  }

  @Input()
  set resource(resource: IResource) {
    this._resource = _.cloneDeep(resource);
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

  get resource() {
    return this._resource;
  }

  @Input()
  tree: IHL7v2TreeNode[];

  @Input()
  nodes: IHL7V2ProfileComponentItemNode[];

  @Output()
  changes: EventEmitter<IProfileComponentChange>;
  @Output()
  removeItem: EventEmitter<string>;

  changes$: Observable<IChange>;
  type: Type;
  cols: ColumnOptions;
  _resource: IResource;
  selectedColumns: ColumnOptions;
  s_resource: Subscription;
  context: IBindingContext;
  treeSubscriptions: Subscription[];
  itemsList: ProfileComponentStructureTreeItemMap;

  readonly trackBy = (index, item) => {
    return item.id;
  }

  constructor() {
    this.treeSubscriptions = [];
    this.treeExpandedNodes = [];
    this.changes = new EventEmitter<IProfileComponentChange>();
    this.removeItem = new EventEmitter<string>();
  }

  columnActive(type: HL7v2TreeColumnType, location: string) {
    switch (type) {
      case HL7v2TreeColumnType.PATH:
        return true;
      case HL7v2TreeColumnType.NAME:
        return this.itemsList.value[location] && Object.keys(this.itemsList.value[location]).length > 0;
      case HL7v2TreeColumnType.USAGE:
        return this.itemsList.has(location, PropertyType.USAGE, PropertyType.PREDICATE);
      case HL7v2TreeColumnType.CONSTANTVALUE:
        return this.itemsList.has(location, PropertyType.CONSTANTVALUE);
      case HL7v2TreeColumnType.CARDINALITY:
        return this.itemsList.has(location, PropertyType.CARDINALITYMAX, PropertyType.CARDINALITYMIN);
      case HL7v2TreeColumnType.CONFLENGTH:
        return this.itemsList.has(location, PropertyType.CONFLENGTH);
      case HL7v2TreeColumnType.LENGTH:
        return this.itemsList.has(location, PropertyType.LENGTHMIN, PropertyType.LENGTHMAX);
      case HL7v2TreeColumnType.DATATYPE:
        return this.itemsList.has(location, PropertyType.DATATYPE);
      case HL7v2TreeColumnType.VALUESET:
        return this.itemsList.has(location, PropertyType.VALUESET) || this.itemsList.has(location, PropertyType.SINGLECODE);
      default:
        return false;
    }
  }

  changeItem(change: IProfileComponentChange) {
    this.itemsList.update(change);
    this.changes.emit(change);
  }

  clear(pathId: string) {
    this.removeItem.next(pathId);
  }

  ngOnDestroy() {
  }

  ngOnInit() {
  }
}
