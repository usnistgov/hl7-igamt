import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {TREE_ACTIONS, TreeComponent, TreeModel, TreeNode} from 'angular-tree-component';

import {ContextMenuComponent} from 'ngx-contextmenu';
import {Type} from '../../../shared/constants/type.enum';
import {NodeHelperService} from '../../../shared/services/node-helper.service';
import {IGDisplayInfo} from '../../models/ig/ig-document.class';

@Component({
  selector: 'app-ig-toc',
  templateUrl: './ig-toc.component.html',
  styleUrls: ['./ig-toc.component.scss'],
})
export class IgTocComponent implements OnInit,  AfterViewInit {

  @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;
  @ViewChild('vsLib') vsLib: ElementRef;
  @ViewChild('dtLib') dtLib: ElementRef;
  @ViewChild('segLib') segLib: ElementRef;
  @ViewChild('cpLib') cpLib: ElementRef;
  @ViewChild('top') top: ElementRef;
  @ViewChild(TreeComponent) private tree: TreeComponent;

  options = {
    allowDrag: (node: TreeNode) => node.data.type === Type.TEXT ||
      node.data.type === Type.CONFORMANCEPROFILE ||
      node.data.type === Type.PROFILE,
    actionMapping: {
      mouse: {
        drop: (tree: TreeModel, node: TreeNode, $event: any, {from, to}) => {
          if (from.data.type === Type.TEXT && (!this.isOrphan(to) && to.parent.data.type === Type.TEXT || this.isOrphan(to))) {
            this.update();
          }
          if (from.data.type === Type.PROFILE && this.isOrphan(to)) {
            this.update();
          }
        },
        click: TREE_ACTIONS.ACTIVATE,
      },
      scrollOnActivate: true,
      scrollContainer: this.getScrollContainer(),
    },
  };

  @Input()
  nodes: TreeNode[];

  @Output()
  nodes_state = new EventEmitter<IGDisplayInfo[]>();

  constructor( private nodeHelperService: NodeHelperService) {
  }

  isOrphan(node: any) {
    return node && node.parent && !node.parent.parent;
  }

  ngOnInit() {
    console.log( this.tree.treeModel !== null && this.tree.treeModel );
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
  }
  copySection(node) {
    this.nodeHelperService.cloneNode(node);
    this.update();
  }
  deleteSection(section) {
    this.nodeHelperService.deleteSection(section.id, this.tree.treeModel);
    this.update();
  }

  addMessage(node) {
  }

  addDatatypes() {
  }

  addValueSets() {
  }

  addSegments() {
  }

  copyConformanceProfile(node) {
  }

  copySegment(node) {
  }

  copyValueSet(node) {
  }

  copyDatatype(node) {
  }

  scrollTo(ref: ElementRef) {
    ref.nativeElement.scrollIntoView();
  }

  getElementUrl(elm) {
    const type = elm.type.toLowerCase();
    return './' + type + '/' + elm.id;
  }
  getPath(node) {
    if ( node ) {
      if (this.isOrphan(node)) {
        return node.data.position + '.';
      } else {
        return this.getPath(node.parent) + node.data.position + '.';
      }
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
    }
  }
  filter(value: any) {
    this.tree.treeModel.filterNodes((node) => {
      return this.nodeHelperService.getFilteringLabel(node.data.fixedName, node.data.variableName).startsWith(value);
    });
  }
  update() {
    this.nodes_state.emit(this.tree.treeModel.nodes);
  }
  getScrollContainer() {
  return  document.getElementById('sidebar-content');
  }
  ngAfterViewInit() {
  }
  }
