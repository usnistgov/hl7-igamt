import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {IUsageDialogData} from '../usage-dialog/usage-dialog.component';

@Component({
  selector: 'app-deactivating-dialog',
  templateUrl: './deactivating-dialog.component.html',
  styleUrls: ['./deactivating-dialog.component.css'],
})
export class DeactivatingDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeactivatingDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IUsageDialogData) {
  }
  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close();
  }
  proceed() {
  }

}
