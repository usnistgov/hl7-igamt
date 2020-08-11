import { Component, Input, OnInit } from '@angular/core';
import { TreeNode } from 'angular-tree-component';

@Component({
  selector: 'app-table-of-content',
  templateUrl: './table-of-content.component.html',
  styleUrls: ['./table-of-content.component.scss'],
})
export class TableOfContentComponent implements OnInit {

  @Input()
  nodes: TreeNode[];
  options;

  constructor() {
    this.options = {
      allowDrag: (node: TreeNode) => {
        return false;
      },
      actionMapping: {
        mouse: {
          click: () => { },
        },
      },
    };
  }

  getElementUrl(elm): string {
    const type = elm.type.toLowerCase();
    return './' + type + '/' + elm.id;
  }

  ngOnInit() {
  }

}
