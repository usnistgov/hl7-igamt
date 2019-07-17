import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {IUsages} from '../../models/cross-reference';

@Component({
  selector: 'app-usage-dialog',
  templateUrl: './usage-dialog.component.html',
  styleUrls: ['./usage-dialog.component.css'],
})
export class UsageDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<UsageDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IUsageDialogData) {
  }
  ngOnInit() {
  }
}

export interface IUsageDialogData {
  title: string;
  usages:  IUsages[];
}
