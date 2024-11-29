import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TreeNode, TreeTable } from 'primeng/primeng';
import { map } from 'rxjs/operators';
import { Type } from '../../constants/type.enum';

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
  PRIVATE = 'PRIVATE',
  SHARED = 'SHARED',
  PUBLIC = 'PUBLIC',
  WORKSPACES = 'WORKSPACES',
}

export interface IBrowseScope {
  private: boolean;
  sharedWithMe: boolean;
  public: boolean;
  workspaces: boolean;
}

export interface IEntity {
  id: string;
  label: string;
  type: Type;
}

export interface IBrowserTreeNodeData {
  id: string;
  label: string;
  latestId?: string;
  type: Type;
  readOnly: boolean;
  children?: IBrowserTreeNode[];
}

export interface IBrowserTreeNode extends TreeNode {
  data: IBrowserTreeNodeData;
  parent?: IBrowserTreeNode;
  children?: IBrowserTreeNode[];
}

export interface IOption {
  label: string;
  key: string;
  value: boolean;
  checked?: (node: IBrowserTreeNode) => boolean;
}

export interface IBrowseDialogData {
  browserType: BrowseType;
  includeVersions: boolean;
  scope: IBrowseScope;
  types: Type[];
  multi: boolean;
  exclude?: Array<{ id: string; type: Type; }>;
  selectionMode: 'multiple' | 'single';
}

@Component({
  selector: 'app-codeset-browse-dialog',
  templateUrl: './codeset-browse-dialog.component.html',
  styleUrls: ['./codeset-browse-dialog.component.scss'],
})
export class CodeSetBrowseDialogComponent implements OnInit {
  BrowserScope = BrowserScope;
  selected: IBrowserTreeNode & IBrowserTreeNode[];
  selectionMode: 'single' | 'multiple' = 'multiple';
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
  showDeprecated = false;
  @ViewChild('tt') treeTable: TreeTable;
  filterText: string;
  includeVersions = false;

  constructor(
    public dialogRef: MatDialogRef<CodeSetBrowseDialogComponent>,
    public http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: IBrowseDialogData,
  ) {
    this.browser = data;
    this.includeVersions = this.browser.includeVersions || false;
    if (this.browser.scope.private) {
      this.getTreeByScope(BrowserScope.PRIVATE);
    } else if (this.browser.scope.public) {
      this.getTreeByScope(BrowserScope.PUBLIC);
    } else if (this.browser.scope.sharedWithMe) {
      this.getTreeByScope(BrowserScope.SHARED);
    } else if (this.browser.scope.workspaces) {
      this.getTreeByScope(BrowserScope.WORKSPACES);
    }
    this.selectionMode = data.selectionMode || 'multiple';
  }

  track = (n) => n.key;

  getTreeByScope(scope: BrowserScope) {
    this.scope = scope;
    this.http.get<IBrowserTreeNode[]>('/api/browser/codesets/' + scope, { params: { includeVersions: this.includeVersions.toString() } }).pipe(
      map((nodes) => {
        const n = this.processNodes(nodes);
        this.browserTree = [
          ...n,
        ];
        this.treeTable.first = 0;
      }),
    ).subscribe();
  }

  filterTextChanged(text: string) {
    this.treeTable.filter(text, 'label', 'contains');
  }

  cancel() {
    this.dialogRef.close();
  }

  done() {
    this.dialogRef.close(this.selected);
  }

  clear(i: number) {
    if (Array.isArray(this.selected)) {
      this.selected.splice(i, 1);
    }
  }

  clearSelection() {
    this.selected = undefined;
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
