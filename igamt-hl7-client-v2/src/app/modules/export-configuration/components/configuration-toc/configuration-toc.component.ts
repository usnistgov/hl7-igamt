import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TreeModel, TreeNode } from 'angular-tree-component';

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
  select: EventEmitter<TreeNode>;
  options;

  constructor() {
    this.select = new EventEmitter();
    this.options = {
      allowDrag: (node: TreeNode) => false,
      actionMapping: {
        mouse: {
          click: (node) => this.onSelect(node),
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
