import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TREE_ACTIONS, TreeComponent, TreeModel, TreeNode} from 'angular-tree-component';
import {ContextMenuComponent} from 'ngx-contextmenu';
import {SelectItem} from 'primeng/api';
import {Scope} from '../../../shared/constants/scope.enum';
import {Type} from '../../../shared/constants/type.enum';
import {ICopyResourceData} from '../../../shared/models/copy-resource-data';
import {IDisplayElement} from '../../../shared/models/display-element.interface';
import {NodeHelperService} from '../../../shared/services/node-helper.service';
import {IAddNewWrapper, IAddWrapper} from '../../models/ig/add-wrapper.class';
import {IClickInfo} from '../../models/toc/click-info.interface';

@Component({
  selector: 'app-ig-toc',
  templateUrl: './ig-toc.component.html',
  styleUrls: ['./ig-toc.component.scss'],
})
export class IgTocComponent implements OnInit, AfterViewInit {
  optionsToDisplay: any;
  deltaOptions: SelectItem[] = [{ label: 'CHANGED', value: 'UPDATED' }, { label: 'DELETED', value: 'DELETED' }, { label: 'ADDED', value: 'ADDED'}];

  @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;
  @ViewChild('vsLib') vsLib: ElementRef;
  @ViewChild('dtLib') dtLib: ElementRef;
  @ViewChild('segLib') segLib: ElementRef;
  @ViewChild('cpLib') cpLib: ElementRef;
  @ViewChild('top') top: ElementRef;
  // TODO set type
  options;
  _nodes: TreeNode[];
  @Input()
  nodes: TreeNode[];
  @Input()
  delta: boolean;

  @Output()
  nodeState = new EventEmitter<IDisplayElement[]>();
  @Output()
  copy = new EventEmitter<ICopyResourceData>();
  @Output()
  delete = new EventEmitter<IDisplayElement>();
  @Output()
  addChildren = new EventEmitter<IAddWrapper>();
  @Output()
  addChild = new EventEmitter<IAddNewWrapper>();
  @ViewChild(TreeComponent) private tree: TreeComponent;

  constructor(private nodeHelperService: NodeHelperService, private cd: ChangeDetectorRef, private router: Router, private activatedRoute: ActivatedRoute) {
    this.options = {
      allowDrag: (node: TreeNode) => node.data.type === Type.TEXT ||
        node.data.type === Type.CONFORMANCEPROFILE ||
        node.data.type === Type.PROFILE,
      actionMapping: {
        mouse: {
          drop: (tree: TreeModel, node: TreeNode, $event: any, { from, to }) => {
            if (from.data.type === Type.TEXT && (!this.isOrphan(to) && to.parent.data.type === Type.TEXT || this.isOrphan(to))) {
              TREE_ACTIONS.MOVE_NODE(tree, node, $event, { from, to });
              this.update();
            }
            if (from.data.type === Type.PROFILE && this.isOrphan(to)) {
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
    console.log(this.nodes)

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
    this.router.navigate(['./text', id], {relativeTo: this.activatedRoute});

  }

  deleteSection(section) {
    this.nodeHelperService.deleteSection(section.id, this.tree.treeModel);
    this.update();
  }

  import(node, type: Type, scope: Scope) {
    this.addChildren.emit({ node, type, scope });
  }
  copyResource(node: TreeNode) {
    this.copy.emit({element: {...node.data}, existing: node.parent.data.children});
  }
  deleteResource(node: TreeNode) {
    this.delete.emit(node.data);
  }

  scrollTo(ref: ElementRef) {
    ref.nativeElement.scrollIntoView();
  }

  getElementUrl(elm): string {
    const type = elm.type.toLowerCase();
    return './' + type + '/' + elm.id;
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
    this.addChild.emit({node, type});
  }

  filterByDelta($event: string[]) {
    console.log('filter called');
    this.tree.treeModel.filterNodes((node) => node.data.delta != null && $event.indexOf(node.data.delta) > -1 && node.data.Type !== Type.TEXT);
  }
}
