import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IGeneratedAPIKey } from 'src/app/modules/core/services/api-key.service';

@Component({
  selector: 'app-key-dialog',
  templateUrl: './key-dialog.component.html',
  styleUrls: ['./key-dialog.component.scss'],
})
export class KeyDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<KeyDialogComponent>,
    public http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: { key: IGeneratedAPIKey },
  ) {

  }

  copy() {
    window.navigator['clipboard'].writeText(this.data.key.plainToken);
  }

  close() {
    this.dialogRef.close();
  }

}
