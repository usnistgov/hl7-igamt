import {HttpClient} from '@angular/common/http';
import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {SelectItem} from 'primeng/api';
import {Observable} from 'rxjs';
import {IgListItem} from '../../../document/models/document/ig-list-item.class';

@Component({
  selector: 'app-sharing-dialog',
  templateUrl: './sharing-dialog.component.html',
  styleUrls: ['./sharing-dialog.component.css'],
})
export class SharingDialogComponent implements OnInit {

  newSharedUser: any;
  filteredUsersSingle: any[];
  users: any[];
  currentAuthor: string;
  selectedUser: string;
  title = 'Shared Users for ';

  sharedUsers: SelectItem[] = [];
   changed = false;

  constructor(public dialogRef: MatDialogRef<SharingDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IShareDialogData,
              private http: HttpClient) {
  }

  ngOnInit() {
    this.fetchUsers().subscribe((data: any) => {
      this.users = data.users;
    });

    this.sharedUsers.push({label: this.data.username + ' #Owner', value: this.data.username});
    if (this.data && this.data.item) {
      if (this.data.item.sharedUsers) {
        this.data.item.sharedUsers.forEach((u) => {
          this.sharedUsers.push({label: u, value: u});
        });
      }

      this.title = this.title + this.data.item.title;
    }

    if (this.data && this.data.item) {
      if (!this.data.item.currentAuthor) {
        this.currentAuthor = this.data.username;
      } else {
        this.currentAuthor = this.data.item.currentAuthor;
      }
    }
  }

  fetchUsers(): Observable<any> {
    return this.http.get<any>('api/users');
  }

  filterUsersSingle(event) {
    const query = event.query;
    this.filteredUsersSingle = this.filterUser(query);
  }

  filterUser(query): string[] {
    const filtered: string[] = [];
    if (this.users) {
      for (const user of this.users) {
        if (user.username.toLowerCase().indexOf(query.toLowerCase()) === 0) {
          filtered.push(user);
        }
        if (user.username.toLowerCase() === query.toLowerCase()) {
          this.newSharedUser = user;
        }
      }
    }
    return filtered;
  }

  addUser() {
    if (!this.checkUser()) {
      this.sharedUsers.push({label: this.newSharedUser.username, value: this.newSharedUser.username});
      this.changed = true;
    }
  }

  tableListBoxSelectEvent(event) {
    if (event && event.value) {
      this.currentAuthor = event.value;
    }
  }

  removeUser(user) {
    this.changed = true;
    this.sharedUsers.forEach( (item, index) => {
      if (item === user) {
        this.sharedUsers.splice(index, 1);
        if (user.value === this.currentAuthor) {
          this.currentAuthor = this.data.username;
        }
      }
    });
  }

  checkUser() {
    if (this.newSharedUser && this.newSharedUser.username) {
      for (const entry of this.sharedUsers) {
        if (entry.value === this.newSharedUser.username) {
          return true;
        }
      }
      return false;
    }
    return true;

  }

  submit() {
    this.dialogRef.close(this.result());
  }
  cancel() {
    this.dialogRef.close();
  }

  result() {
    const out: any = {};
    if (this.currentAuthor === this.data.username) {
      out.currentAuthor = null;
    } else {
      out.currentAuthor = this.currentAuthor;
    }

    out.sharedUsers = [];
    for (const entry of this.sharedUsers) {
      if (entry.value !== this.data.username) {
        out.sharedUsers.push(entry.value);
      }
    }
    return out;
  }
}

export interface IShareDialogData {
  item: IgListItem;
  username: string;
}
