import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TreeNode, TreeTable } from 'primeng/primeng';
import { map } from 'rxjs/operators';
import { Type } from '../../constants/type.enum';
import { IDomainInfo } from '../../models/domain-info.interface';

export enum BrowseType {
  LOCATION = 'LOCATION',
  ENTITY = 'ENTITY',
}

export enum BrowserColumn {
  NAME = 'NAME',
  TYPE = 'TYPE',
  DATE = 'DATE',
}

export enum BrowserScope {
  PRIVATE_IG_LIST = 'PRIVATE_IG_LIST',
  PUBLIC_IG_LIST = 'PUBLIC_IG_LIST',
  WORKSPACES = 'WORKSPACES',
}

export interface IBrowseScope {
  privateIgList: boolean;
  publicIgList: boolean;
  workspaces: boolean;
}

export interface IEntity {
  id: string;
  label: string;
  type: Type;
  domainInfo?: IDomainInfo;
}

export interface IBrowserTreeNodeData {
  id: string;
  label: string;
  type: Type;
  domainInfo?: IDomainInfo;
  dateUpdated: Date;
  readOnly: boolean;
  children?: IBrowserTreeNode[];
}

export interface IBrowserTreeNode extends TreeNode {
  data: IBrowserTreeNodeData;
  parent?: IBrowserTreeNode;
  children?: IBrowserTreeNode[];
}

export interface IEntityBrowserResult {
  node: IBrowserTreeNode;
  name: string;
}

export interface IOption {
  label: string;
  key: string;
  value: boolean;
  checked?: (node: IBrowserTreeNode) => boolean;
}

export interface IBrowseDialogData {
  browserType: BrowseType;
  scope: IBrowseScope;
  types: Type[];
  multi: boolean;
  exclude?: Array<{ id: string; type: Type; }>;
}

@Component({
  selector: 'app-entity-browse-dialog',
  templateUrl: './entity-browse-dialog.component.html',
  styleUrls: ['./entity-browse-dialog.component.scss'],
})
export class EntityBrowseDialogComponent implements OnInit {
  BrowserScope = BrowserScope;
  selected: IBrowserTreeNode;
  scope: BrowserScope;
  browser: IBrowseDialogData;
  browserTree: IBrowserTreeNode[] = [];
  colType = BrowserColumn;
  columns = [
    BrowserColumn.NAME,
    BrowserColumn.TYPE,
    BrowserColumn.DATE,
  ];
  options: FormGroup;
  name: string;
  @ViewChild('tt') treeTable: TreeTable;

  constructor(
    public dialogRef: MatDialogRef<EntityBrowseDialogComponent>,
    public http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: IBrowseDialogData,
  ) {
    this.browser = data;
    if (this.browser.scope.privateIgList) {
      this.getTreeByScope(BrowserScope.PRIVATE_IG_LIST);
    } else if (this.browser.scope.publicIgList) {
      this.getTreeByScope(BrowserScope.PUBLIC_IG_LIST)
    } else if (this.browser.scope.workspaces) {
      this.getTreeByScope(this.scope = BrowserScope.WORKSPACES);
    }
  }

  track = (n) => n.key;

  getTreeByScope(scope: BrowserScope) {
    this.scope = scope;
    this.http.get<IBrowserTreeNode[]>('/api/browser/' + scope).pipe(
      map((nodes) => {
        const n = this.processNodes(nodes);
        this.browserTree = [
          ...n,
        ];
        this.treeTable.first = 0;
      }),
    ).subscribe();
  }

  cancel() {
    this.dialogRef.close();
  }

  done() {
    this.dialogRef.close({ node: this.selected, name: this.name });
  }

  clear() {
    this.selected = null;
  }

  nodeUpdate(n) {
    this.name = n.node.data.label + ' [CLONE]';
  }

  isExcluded(node: IBrowserTreeNode) {
    if (!this.browser.exclude) {
      return false;
    }
    return !!this.browser.exclude.find((n) => node.data.id === n.id && node.data.type === n.type);
  }

  processNodes(nodes: IBrowserTreeNode[]) {
    for (const node of nodes) {
      if (!(this.browser.types || []).includes(node.data.type)) {
        node.selectable = false;
      } else if (this.isExcluded(node)) {
        node.selectable = false;
      } else {
        node.selectable = true;
      }
      if (node.children) {
        this.processNodes(node.children);
      }
    }
    return nodes;
  }

  ngOnInit() {
  }

}
