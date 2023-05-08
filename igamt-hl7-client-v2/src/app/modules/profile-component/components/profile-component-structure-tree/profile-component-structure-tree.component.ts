import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { IResource } from 'src/app/modules/shared/models/resource.interface';
import { IPathInfo } from 'src/app/modules/shared/services/element-naming.service';
import { Hl7V2TreeService } from 'src/app/modules/shared/services/hl7-v2-tree.service';
import { selectIgConfig } from 'src/app/root-store/ig/ig-edit/ig-edit.selectors';
import {
  ColumnOptions,
  HL7v2TreeColumnType,
  IHL7v2TreeNode,
  IHL7v2TreeNodeData,
} from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../../../shared/constants/type.enum';
import { IDocumentRef } from '../../../shared/models/abstract-domain.interface';
import { Hl7Config, IValueSetBindingConfigMap } from '../../../shared/models/config.class';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IItemProperty, IProfileComponentBinding, IProfileComponentItem } from '../../../shared/models/profile.component';
import { IChange, PropertyType } from '../../../shared/models/save-change';
import { AResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { IBindingContext } from '../../../shared/services/structure-element-binding.service';
import { ProfileComponentRefChange } from '../../services/profile-component-ref-change.object';
import { ProfileComponentStructureTreeItemMap } from '../../services/profile-component-structure-tree-item-map.object';
import { IUserConfig } from './../../../shared/models/config.class';

export interface IItemLocation {
  path: string;
  parent: string;
  target: string;
}
export interface IHL7V2ProfileComponentItemNode {
  location: {
    pathId: string;
    name: string;
    positionalPath: string;
    pathInfo: IPathInfo;
  };
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
  public userConfig: Observable<IUserConfig>;

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
  set treeView(tv: boolean) {
    this.treeView$.next(tv);
  }

  get treeView() {
    return this.treeView$.getValue();
  }

  @Input()
  set tree(tree: IHL7v2TreeNode[]) {
    this.tree$.next(tree);
  }

  get tree() {
    return this.tree$.getValue();
  }

  @Input()
  refChangeMap: ProfileComponentRefChange;

  @Input()
  set nodes(nodes: IHL7V2ProfileComponentItemNode[]) {
    this.nodes$.next(nodes);
  }

  get nodes() {
    return this.nodes$.getValue();
  }

  @Output()
  changes: EventEmitter<IProfileComponentChange>;
  @Output()
  removeItem: EventEmitter<IItemLocation>;

  changes$: Observable<IChange>;
  cols: ColumnOptions;
  _resource: IResource;
  selectedColumns: ColumnOptions;
  s_resource: Subscription;
  context: IBindingContext;
  treeSubscriptions: Subscription[];
  itemsList: ProfileComponentStructureTreeItemMap;
  activeNodes$: Observable<Array<IHL7V2ProfileComponentItemNode | IHL7v2TreeNode>>;
  nodes$: BehaviorSubject<IHL7V2ProfileComponentItemNode[]>;
  tree$: BehaviorSubject<IHL7v2TreeNode[]>;
  treeView$: BehaviorSubject<boolean>;

  readonly trackBy = (index, item) => {
    return item.id;
  }

  constructor(
    private treeService: Hl7V2TreeService, private store: Store<any>,
  ) {
    this.treeSubscriptions = [];
    this.treeExpandedNodes = [];
    this.changes = new EventEmitter<IProfileComponentChange>();
    this.removeItem = new EventEmitter<IItemLocation>();
    this.activeNodes$ = new BehaviorSubject([]);
    this.nodes$ = new BehaviorSubject([]);
    this.tree$ = new BehaviorSubject([]);
    this.treeView$ = new BehaviorSubject(false);

    this.userConfig = this.store.select(selectIgConfig).pipe(
      filter((config) => !!config),
    );

    this.activeNodes$ = combineLatest([
      this.treeView$,
      this.tree$,
      this.nodes$,
    ]).pipe(
      map(([tv, tree, nodes]) => {
        if (tv) { return tree[0].children; }
        return this.prune(nodes);
      }),
    );
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
      case HL7v2TreeColumnType.SEGMENT:
        return this.itemsList.has(location, PropertyType.SEGMENTREF);
      default:
        return false;
    }
  }

  changeItem(change: IProfileComponentChange) {
    console.log(this.itemsList);
    this.itemsList.update(change);
    this.changes.emit(change);
  }

  clear(path: string, elementId: string) {
    this.removeItem.next({
      path,
      parent: this.getParentLocation(path),
      target: elementId,
    });
  }

  getParentLocation(path: string) {
    return path.includes('-') ? path.substring(0, path.lastIndexOf('-')) : '';
  }

  onNodeExpand({ node }: { node: IHL7v2TreeNode }) {
    const ref = this.refChangeMap ? this.refChangeMap.getPath(node.data.pathId) : node.data.ref.getValue();
    this.treeService.loadNodeChildren(node, this.repository, ref).pipe(
      take(1),
    ).subscribe();
  }

  prune(nodes: Array<IHL7V2ProfileComponentItemNode | IHL7v2TreeNode>) {
    return (nodes || []).map((n) => ({
      ...n,
      children: [],
    }));
  }

  ngOnDestroy() {
  }

  ngOnInit() {
  }
}
