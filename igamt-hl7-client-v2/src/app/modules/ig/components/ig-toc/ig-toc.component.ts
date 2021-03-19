import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TREE_ACTIONS, TreeComponent, TreeModel, TreeNode } from 'angular-tree-component';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { SelectItem } from 'primeng/api';
import {IAddNewWrapper, IAddWrapper} from '../../../document/models/document/add-wrapper.class';
import {IClickInfo} from '../../../document/models/toc/click-info.interface';
import { Scope } from '../../../shared/constants/scope.enum';
import { Type } from '../../../shared/constants/type.enum';
import { ICopyResourceData } from '../../../shared/models/copy-resource-data';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { NodeHelperService } from '../../../shared/services/node-helper.service';
import { ValueSetService } from '../../../value-set/service/value-set.service';

@Component({
  selector: 'app-ig-toc',
  templateUrl: './ig-toc.component.html',
  styleUrls: ['./ig-toc.component.scss'],
})
export class IgTocComponent implements OnInit, AfterViewInit {
  optionsToDisplay: any;
  deltaOptions: SelectItem[] = [{ label: 'CHANGED', value: 'UPDATED' }, { label: 'DELETED', value: 'DELETED' }, { label: 'ADDED', value: 'ADDED' }];

  @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;
  @ViewChild('vsLib') vsLib: ElementRef;
  @ViewChild('dtLib') dtLib: ElementRef;
  @ViewChild('segLib') segLib: ElementRef;
  @ViewChild('cpLib') cpLib: ElementRef;
  @ViewChild('ccgLib') ccgLib: ElementRef;
  @ViewChild('top') top: ElementRef;
  @ViewChild('pcLib') pcLib: ElementRef;

  // TODO set type
  options;
  _nodes: TreeNode[];
  @Input()
  nodes: TreeNode[];
  @Input()
  delta: boolean;
  @Input()
  viewOnly: boolean;

  @Output()
  nodeState = new EventEmitter<IDisplayElement[]>();
  @Output()
  copy = new EventEmitter<ICopyResourceData>();
  @Output()
  delete = new EventEmitter<IDisplayElement>();
  @Output()
  deleteContext = new EventEmitter<{child: IDisplayElement, parent: IDisplayElement}>();
  @Output()
  deleteNarrative = new EventEmitter<string>();
  @Output()
  addChildren = new EventEmitter<IAddWrapper>();
  @Output()
  addChild = new EventEmitter<IAddNewWrapper>();
  @Output()
  addVSFromCSV = new EventEmitter<any>();
  @Output()
  addPcChildren = new EventEmitter<IDisplayElement>();

  @ViewChild(TreeComponent) private tree: TreeComponent;

  constructor(private nodeHelperService: NodeHelperService, private valueSetService: ValueSetService, private cd: ChangeDetectorRef, private router: Router, private activatedRoute: ActivatedRoute) {
    this.options = {
      allowDrag: (node: TreeNode) => { return !(this.viewOnly || this.delta) && (node.data.type === Type.TEXT ||
        node.data.type === Type.CONFORMANCEPROFILE ||
        node.data.type === Type.PROFILE);
      },
      actionMapping: {
        mouse: {
          drop: (tree: TreeModel, node: TreeNode, $event: any, { from, to }) => {
            if (from.data.type === Type.TEXT && (!this.isOrphan(to) && to.parent.data.type === Type.TEXT || this.isOrphan(to))) {
              TREE_ACTIONS.MOVE_NODE(tree, node, $event, { from, to });
              this.update();
            }
            if (from.data.type === Type.CONFORMANCEPROFILE && to.parent.data.type === Type.CONFORMANCEPROFILEREGISTRY) {
              TREE_ACTIONS.MOVE_NODE(tree, node, $event, { from, to });
              this.update();
            }
          },
          click: () => { },
        },
      },
    };
  }

  isOrphan(node: any) {
    return node && node.parent && !node.parent.parent;
  }

  ngOnInit() {
    console.log(this.nodes);
  }

  print() {
    console.log(document.getElementById('toc-container'));
  }

  addSectionToNode(node) {
    this.nodeHelperService.addNode(node);
    this.update();
  }

  addSectionToIG() {
    this.nodeHelperService.addNodeToRoot(this.tree.treeModel);
    this.update();
  }

  copySection(node) {
    const id = this.nodeHelperService.cloneNode(node);
    this.update();
    this.router.navigate(['./text', id], { relativeTo: this.activatedRoute });
  }

  deleteSection(section) {
    this.nodeHelperService.deleteSection(section.id, this.tree.treeModel);
    this.update();
    this.deleteNarrative.emit(section.id);
  }

  import(node, type: Type, scope: Scope) {
    this.addChildren.emit({ node, type, scope });
  }

  importCSV(node, type: Type, scope: Scope) {
    this.addVSFromCSV.emit({ node, type, scope });
  }

  copyResource(node: TreeNode) {
    this.copy.emit({ element: { ...node.data }, existing: node.parent.data.children });
  }

  exportCSVFileForVS(node: TreeNode) {
    this.valueSetService.exportCSVFile(node.data.id);
    console.log(node.data);
  }

  deleteResource(node: TreeNode) {
    this.delete.emit(node.data);
  }

  scrollTo(ref: ElementRef) {
    ref.nativeElement.scrollIntoView();
  }

  getElementUrl(elm): string {
    const type = elm.type.toLowerCase();
    const path = './' + type + '/' + elm.id;
    if (!this.delta || !elm.origin) {
      return path;
    } else {
      return path + '/' + 'delta';
    }
  }
  scroll(type: string) {
    if (type === 'messages') {
      this.cpLib.nativeElement.scrollIntoView();
    } else if (type === 'segments') {
      this.segLib.nativeElement.scrollIntoView();
    } else if (type === 'datatypes') {
      this.dtLib.nativeElement.scrollIntoView();
    } else if (type === 'valueSets') {
      this.vsLib.nativeElement.scrollIntoView();
    } else if (type === 'coConstraintGroups') {
      this.ccgLib.nativeElement.scrollIntoView();
    } else if (type === 'profilecomponents') {
      this.pcLib.nativeElement.scrollIntoView();
    }
  }

  filter(value: string) {
    this.tree.treeModel.filterNodes((node) => {
      return this.nodeHelperService
        .getFilteringLabel(node.data.fixedName, node.data.variableName).toLowerCase()
        .startsWith(value.toLowerCase());
    });
  }

  update() {
    this.nodeState.emit(this.tree.treeModel.nodes);
  }

  getScrollContainer() {
    return document.getElementById('toc-container');
  }

  ngAfterViewInit() {
  }

  expandAll() {
    this.tree.treeModel.expandAll();
  }

  collapseAll() {
    this.tree.treeModel.collapseAll();
  }

  select($event: IClickInfo) {
    console.log($event);
  }
  createNew(node: IDisplayElement, type: Type) {
    this.addChild.emit({ node, type });
  }

  filterByDelta($event: string[]) {
    this.tree.treeModel.filterNodes((node) => node.data.delta != null && $event.indexOf(node.data.delta) > -1 && node.data.Type !== Type.TEXT);
  }

  getPcElementUrl(treeNode: TreeNode) {
    let url = this.getElementUrl(treeNode.parent.data);
    if (treeNode.parent && treeNode.parent.data) {
      // tslint:disable-next-line:no-collapsible-if
     if (treeNode.data.type === Type.SEGMENTCONTEXT ) {
       url = url + '/segment/' + treeNode.data.id;
     }
     if (treeNode.data.type === Type.MESSAGECONTEXT ) {
       url = url + '/message/' + treeNode.data.id;
     }
    }
    return url;
  }

  addPcContexts(node) {
    this.addPcChildren.emit(node.data);
  }

  deleteOneChild(child: IDisplayElement, parent: IDisplayElement) {
    this.deleteContext.emit({child, parent});
  }
}
