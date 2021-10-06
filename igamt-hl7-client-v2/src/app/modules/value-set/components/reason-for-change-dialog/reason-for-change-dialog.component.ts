import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {IChangeReason, PropertyType} from '../../../shared/models/save-change';

@Component({
  selector: 'app-reason-for-change-dialog',
  templateUrl: './reason-for-change-dialog.component.html',
  styleUrls: ['./reason-for-change-dialog.component.css'],
})
export class ReasonForChangeDialogComponent implements OnInit {
  existingChangeReason:  IChangeReason[];
  text: string;
  edit: any = {};
  viewOnly: boolean;

  constructor(public dialogRef: MatDialogRef<ReasonForChangeDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.existingChangeReason = data.existing;
    this.viewOnly = data.viewOnly;
  }

  ngOnInit() {
  }
  logReason() {
  this.existingChangeReason.push({
    reason: this.text,
    date: new Date(),
  });
  }

  done() {
    if (this.text && this.text.length) {
      this.logReason();
    }
    this.dialogRef.close(this.existingChangeReason);
  }

  clearReason() {
    this.dialogRef.close();
  }

  remove(i: number) {
      if (i > -1) {
        this.existingChangeReason.splice(i, 1);
      }
  }
  toggleEdit(boolean, i) {
    this.edit[i] = boolean;
  }
}
