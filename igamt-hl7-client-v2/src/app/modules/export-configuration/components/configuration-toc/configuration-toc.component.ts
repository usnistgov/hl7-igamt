import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TREE_ACTIONS, TreeNode } from 'angular-tree-component';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';

@Component({
  selector: 'app-configuration-toc',
  templateUrl: './configuration-toc.component.html',
  styleUrls: ['./configuration-toc.component.scss'],
})
export class ConfigurationTocComponent implements OnInit {

  @Input()
  nodes: TreeNode[];
  @Input()
  decision: any = {}; // model to be defined

  @Output()
  select: EventEmitter<IDisplayElement>;
  options;

  constructor() {
    this.select = new EventEmitter();
    this.options = {
      allowDrag: (node: TreeNode) => false,
      actionMapping: {
        mouse: {
          click: (tree, node, event) => {
            TREE_ACTIONS.TOGGLE_SELECTED(tree, node, event);
            this.onSelect(node.data);
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

  ngOnInit() {
  }

}
