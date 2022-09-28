import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IFolderInfo, IWorkspacePermissions } from '../../models/models';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.scss'],
})
export class AddUserDialogComponent implements OnInit {

  folders: IFolderInfo[];
  username: string;
  permissions: IWorkspacePermissions;
  edit: boolean;

  constructor(
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.folders = data.folders;
    this.username = data.username;
    this.edit = data.edit;
    this.permissions = data.permissions || {};
  }

  create() {
    this.dialogRef.close({
      username: this.username,
      permissions: this.permissions,
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  updatePermissions(p) {
    this.permissions = p;
  }

  ngOnInit() {
  }

}
