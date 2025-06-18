import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ICodeSetQueryResult } from '../../services/external-codeset.service';

@Component({
  selector: 'app-fetch-codes-dialog',
  templateUrl: './fetch-codes-dialog.component.html',
  styleUrls: ['./fetch-codes-dialog.component.scss'],
})
export class FetchCodesDialogComponent implements OnInit {

  url: string;
  codeSet: ICodeSetQueryResult;

  constructor(
    public dialogRef: MatDialogRef<FetchCodesDialogComponent>,
    public http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {

  }

  setCodeSet(codeSet: ICodeSetQueryResult) {
    this.codeSet = codeSet;
  }

  cancel() {
    this.dialogRef.close();
  }

  done() {
    this.dialogRef.close(this.codeSet);
  }

  ngOnInit() {
  }

}
