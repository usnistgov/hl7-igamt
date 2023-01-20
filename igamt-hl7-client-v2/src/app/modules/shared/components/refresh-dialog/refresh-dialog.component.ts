import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-refresh-dialog',
  templateUrl: './refresh-dialog.component.html',
  styleUrls: ['./refresh-dialog.component.scss'],
})
export class RefreshDialogComponent implements OnInit {

  message: string;
  title: string;

  constructor(
    public dialogRef: MatDialogRef<RefreshDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.message = this.data.message;
    this.title = this.data.title;
  }

  refresh() {
    location.reload();
  }

  ngOnInit() {
  }

}
