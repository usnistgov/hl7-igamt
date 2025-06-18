import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { IgListItem } from '../../../document/models/document/ig-list-item.class';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-sharing-dialog',
  templateUrl: './sharing-dialog.component.html',
  styleUrls: ['./sharing-dialog.component.css'],
})
export class SharingDialogComponent implements OnInit {

  newSharedUser: string;
  filteredUsersSingle: string[];
  users: string[];
  owner: string;
  title: string;
  sharedUsers: string[] = [];
  changed = false;

  constructor(public dialogRef: MatDialogRef<SharingDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IShareDialogData,
              private usersService: UsersService) {
    this.fetchUsers().subscribe((usernames: any) => {
      this.users = usernames;
    });

    if (this.data && this.data.item) {
      if (this.data.item.sharedUsers) {
        this.data.item.sharedUsers.forEach((u) => {
          this.sharedUsers.push(u);
        });
      }

      this.title = 'Share Resource "' + this.data.item.title + '"';
      this.owner = this.data.username;
    }
  }

  fetchUsers(): Observable<string[]> {
    return this.usersService.getUsernames();
  }

  filterUsersSingle(event: any) {
    const query = event.query;
    this.filteredUsersSingle = this.users.filter((u) => u.toLowerCase().indexOf(query.toLowerCase()) !== -1 && u.toLowerCase() !== this.owner);
  }

  addUser(username: string) {
    const exists = this.sharedUsers.includes(username);
    if (!exists && username !== this.owner) {
      this.sharedUsers.push(username);
      this.changed = true;
    }
    this.newSharedUser = '';
  }

  removeUser(user: string) {
    this.changed = true;
    this.sharedUsers.forEach((item, index) => {
      if (item === user) {
        this.sharedUsers.splice(index, 1);
      }
    });
  }

  submit() {
    this.dialogRef.close(this.result());
  }

  cancel() {
    this.dialogRef.close();
  }

  result() {
    return [
      ...this.sharedUsers,
    ];
  }

  ngOnInit() { }

}

export interface IShareDialogData {
  item: IgListItem;
  username: string;
}
