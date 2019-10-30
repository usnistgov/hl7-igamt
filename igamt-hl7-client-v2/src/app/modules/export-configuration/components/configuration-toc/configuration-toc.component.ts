import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TREE_ACTIONS, TreeComponent, TreeNode } from 'angular-tree-component';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { NodeHelperService } from '../../../shared/services/node-helper.service';
import {DeltaAction} from '../../../shared/models/delta';

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

  constructor(private nodeHelperService: NodeHelperService) {
    this.select = new EventEmitter();
    this.options = {
      allowDrag: (node: TreeNode) => false,
      actionMapping: {
        mouse: {
          click: (tree, node, event) => {
            if ( node.data && node.data.delta !== DeltaAction.DELETED) {
              TREE_ACTIONS.TOGGLE_SELECTED(tree, node, event);
              this.onSelect(node.data);
            }
          },
        },
      },
    };
  }

  check($event, elm, type) {
    console.log($event);
    console.log(elm);
    console.log(type);
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

}
