import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TREE_ACTIONS, TreeComponent, TreeNode } from 'angular-tree-component';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { DeltaAction } from '../../../shared/models/delta';
import { NodeHelperService } from '../../../shared/services/node-helper.service';

export enum ProfileActionEventType {
  ADD= 'ADD',
  SELECT_ONLY= 'SELECT_ONLY',
  UNSELECT= 'UNSELECT',
}

export class ProfileActionEventData {
  public type: ProfileActionEventType;
  public profileId: string;
}
@Component({
  selector: 'app-configuration-toc',
  templateUrl: './configuration-toc.component.html',
  styleUrls: ['./configuration-toc.component.scss'],
})

export class ConfigurationTocComponent implements OnInit {

  @Input()
  nodes: TreeNode[];
  @Input()
  filter: any = {}; // model to be defined

  @ViewChild('vsLib') vsLib: ElementRef;
  @ViewChild('dtLib') dtLib: ElementRef;
  @ViewChild('segLib') segLib: ElementRef;
  @ViewChild('cpLib') cpLib: ElementRef;

  @ViewChild(TreeComponent) private tree: TreeComponent;

  @Output()
  select: EventEmitter<IDisplayElement>;
  options;

  @Output()
  profileAction: EventEmitter<ProfileActionEventData>;

  constructor(private nodeHelperService: NodeHelperService) {
    this.profileAction = new EventEmitter();
    this.select = new EventEmitter();
    this.options = {
      allowDrag: (node: TreeNode) => false,
      actionMapping: {
        mouse: {
          click: (tree, node, event) => {
            if (node.data && node.data.delta !== DeltaAction.DELETED) {
              TREE_ACTIONS.TOGGLE_SELECTED(tree, node, event);
              this.onSelect(node.data);
            }
          },
        },
      },
    };
  }
  check($event, elm, type) {
  }

  onSelect(node) {
    this.select.emit(node);
  }

  scrollTo(type: string) {
    if (type === 'messages') {
      this.cpLib.nativeElement.scrollIntoView();
    } else if (type === 'segments') {
      this.segLib.nativeElement.scrollIntoView();
    } else if (type === 'datatypes') {
      this.dtLib.nativeElement.scrollIntoView();
    } else if (type === 'valueSets') {
      this.vsLib.nativeElement.scrollIntoView();
    }
  }

  ngOnInit() {

  }

  filterByname(value: string) {
    this.tree.treeModel.filterNodes((node) => {
      return this.nodeHelperService
        .getFilteringLabel(node.data.fixedName, node.data.variableName).toLowerCase()
        .startsWith(value.toLowerCase());
    });
  }

  addProfileAndDependencies(item) {
    this.profileAction.emit({
       type: ProfileActionEventType.ADD,
       profileId: item.id,
    });
  }
  removeProfileAndDependencies(item) {
    this.profileAction.emit({
       type: ProfileActionEventType.UNSELECT,
       profileId: item.id,
    });
  }
  selectOnlyProfileAndDependencies(item) {
    this.clearFilter();
    this.profileAction.emit({
       type: ProfileActionEventType.SELECT_ONLY,
       profileId: item.id,
    });
  }
  clearFilter() {
    Object.keys(this.filter.conformanceProfileFilterMap).forEach((key) => {
      this.filter.conformanceProfileFilterMap[key] = false;
    });
    Object.keys(this.filter.segmentFilterMap).forEach((key) => {
      this.filter.segmentFilterMap[key] = false;
    });
    Object.keys(this.filter.datatypesFilterMap).forEach((key) => {
      this.filter.datatypesFilterMap[key] = false;
    });
    Object.keys(this.filter.valueSetFilterMap).forEach((key) => {
      this.filter.valueSetFilterMap[key] = false;
    });
    Object.keys(this.filter.overiddedSegmentMap).forEach((key) => {
      this.filter.overiddedSegmentMap[key] = false;
    });
    Object.keys(this.filter.overiddedDatatypesMap).forEach((key) => {
      this.filter.overiddedDatatypesMap[key] = false;
    });
    Object.keys(this.filter.overiddedConformanceProfileMap).forEach((key) => {
      this.filter.overiddedConformanceProfileMap[key] = false;
    });
    Object.keys(this.filter.overiddedCompositeProfileMap).forEach((key) => {
      this.filter.overiddedCompositeProfileMap[key] = false;
    });
    Object.keys(this.filter.overiddedValueSetMap).forEach((key) => {
      this.filter.overiddedValueSetMap[key] = false;
    });
    Object.keys(this.filter.added).forEach((key) => {
      this.filter.added[key] = false;
    });
    Object.keys(this.filter.changed).forEach((key) => {
      this.filter.changed[key] = false;
    });
  }
}
