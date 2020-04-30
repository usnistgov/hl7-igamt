import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-timeout-login-dialog',
  templateUrl: './timeout-login-dialog.component.html',
  styleUrls: ['./timeout-login-dialog.component.scss'],
})
export class TimeoutLoginDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<TimeoutLoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  authenticate(event) {
    this.dialogRef.close(event);
  }

  ngOnInit() {
  }

}
