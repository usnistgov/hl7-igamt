import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import { BrowserColumn, BrowserScope, IBrowserTreeNode } from './../../../shared/components/entity-browse-dialog/entity-browse-dialog.component';
import { IFolderInfo, IWorkspaceInfo, WorkspacePermissionType } from './../../models/models';

@Component({
  selector: 'app-document-move-dialog',
  templateUrl: './document-move-dialog.component.html',
  styleUrls: ['./document-move-dialog.component.scss'],
})
export class DocumentMoveDialogComponent implements OnInit {

  clone: boolean;
  workspaceTree: IBrowserTreeNode[];
  scope: BrowserScope;
  BrowserScope = BrowserScope;
  target: IBrowserTreeNode;
  name: string;
  columns = [
    BrowserColumn.NAME,
    BrowserColumn.TYPE,
  ];
  colType = BrowserColumn;
  title: string;
  folder: IFolderInfo;
  folderViewOnly: boolean;

  constructor(
    public dialogRef: MatDialogRef<DocumentMoveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    const workspaceInfo: IWorkspaceInfo = data.workspace;
    this.folder = data.folder;
    this.folderViewOnly = this.folder.permissionType === WorkspacePermissionType.VIEW;
    this.workspaceTree = workspaceInfo.folders.map((f) => ({
      data: {
        id: f.id,
        label: f.metadata.title,
        type: Type.FOLDER,
        dateUpdated: null,
        readOnly: f.permissionType === WorkspacePermissionType.VIEW,
      },
      selectable: f.permissionType === WorkspacePermissionType.EDIT && f.id !== this.folder.id,
    } as IBrowserTreeNode));
    this.title = data.name;
    this.selectScope(BrowserScope.PRIVATE_IG_LIST);
  }

  selectScope(scope: BrowserScope) {
    this.scope = scope;
    this.clone = scope === BrowserScope.PRIVATE_IG_LIST || this.folderViewOnly;
    this.name = this.title;
  }

  isValid() {
    if (this.scope === BrowserScope.PRIVATE_IG_LIST) {
      return this.clone;
    } else {
      return this.target;
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  done() {
    this.dialogRef.close({
      folderId: this.target ? this.target.data.id : undefined,
      clone: this.clone,
      title: this.name,
    });
  }

  ngOnInit() {
  }

}
