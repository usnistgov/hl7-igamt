import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TreeComponent, TreeNode } from 'angular-tree-component';
import { NodeHelperService } from '../../../shared/services/node-helper.service';
import { CreateDialogComponent } from '../create-dialog/create-dialog.component';

@Component({
  selector: 'app-table-of-content',
  templateUrl: './table-of-content.component.html',
  styleUrls: ['./table-of-content.component.scss'],
})
export class TableOfContentComponent implements OnInit {

  @Input()
  nodes: TreeNode[];
  @Output()
  onCreateExampleMessage: EventEmitter<{ profileId: string, name: string }>;
  @ViewChild(TreeComponent) private tree: TreeComponent;

  options;

  constructor(private dialog: MatDialog, private nodeHelperService: NodeHelperService) {
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
    this.onCreateExampleMessage = new EventEmitter();
  }

  expandAll() {
    this.tree.treeModel.expandAll();
  }

  collapseAll() {
    this.tree.treeModel.collapseAll();
  }

  filter(value: string) {
    this.tree.treeModel.filterNodes((node) => {
      return this.nodeHelperService
        .getFilteringLabel(node.data.fixedName, node.data.variableName).toLowerCase()
        .startsWith(value.toLowerCase());
    });
  }

  createExampleMessage(id: string) {
    this.dialog.open(CreateDialogComponent, {
      data: {
        title: 'Create Example Message'
      }
    }).afterClosed().subscribe((data) => {
      if (data && data.name) {
        this.onCreateExampleMessage.emit({
          name: data.name,
          profileId: id,
        })
      }
    })
  }

  ngOnInit() {
  }


}
