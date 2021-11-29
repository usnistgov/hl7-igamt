import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IChangeReason } from '../../models/save-change';

@Component({
  selector: 'app-change-reason-list-dialog',
  templateUrl: './change-reason-list-dialog.component.html',
  styleUrls: ['./change-reason-list-dialog.component.scss'],
})
export class ChangeReasonListDialogComponent implements OnInit {

  now = new Date();
  additional: string;
  existingChangeReasons: IChangeReason[];
  current: { id: string, description: string };
  previous: { id: string, description: string };
  edit: boolean;
  caption: string;

  constructor(
    public dialogRef: MatDialogRef<ChangeReasonListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.existingChangeReasons = data.changeReason;
    this.edit = data.edit;
    this.current = data.current;
    this.previous = data.previous;
    this.caption = data.caption;
  }

  delete(i: number) {
    this.existingChangeReasons.splice(i, 1);
  }

  cancel() {
    this.dialogRef.close();
  }

  done() {
    this.dialogRef.close([
      ...this.existingChangeReasons ? this.existingChangeReasons : [],
      ...!this.edit ? [{ date: this.now, reason: this.additional }] : [],
    ]);
  }

  ngOnInit() {
  }

}
