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
  usernames: string[] = [];
  filteredUsernames: string[];

  constructor(
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.folders = data.folders;
    this.username = data.username;
    this.edit = data.edit;
    this.permissions = data.permissions || {};
    this.usernames = data.usernames;
    console.log(this.usernames);
  }

  filterUsernames(event: any) {
    const query: string = event.query;
    this.filteredUsernames = this.usernames.filter((u) => u.toLowerCase().indexOf(query.toLowerCase()) !== -1);
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
