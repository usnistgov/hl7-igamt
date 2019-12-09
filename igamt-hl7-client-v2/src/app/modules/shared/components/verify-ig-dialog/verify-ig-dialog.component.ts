import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-verify-ig-dialog',
  templateUrl: './verify-ig-dialog.component.html',
  styleUrls: ['./verify-ig-dialog.component.css'],
})
export class VerifyIgDialogComponent implements OnInit {
  reports: any;
  errorCounts: number[];
  constructor(private http: HttpClient, public dialogRef: MatDialogRef<VerifyIgDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IVerifyIgDialogData) {
    this.reports = null;
  }
  ngOnInit() {
    this.reports = null;
    this.errorCounts = [];
    console.log(this.data);

    if (this.data && this.data.igId) {
      this.http.get<any[]>('/api/igdocuments/' + this.data.igId + '/verify').subscribe((x) => {
        this.reports = x;

        this.errorCounts = this.countErrors(this.reports);

        console.log(this.reports);
      });
    }

  }
  cancel() {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close();
  }

  countErrors(reports) {
    let totalNumOfError = 0;
    let numOfVSError = 0;
    let numOfDTError = 0;
    let numOfSEGError = 0;
    let numOfCPError = 0;
    let numOfIGError = 0;

    reports.valuesetVerificationResults.forEach((item) => {
      numOfVSError = numOfVSError + item.errors.length;
      totalNumOfError = totalNumOfError + item.errors.length;
    });

    reports.datatypeVerificationResults.forEach((item) => {
      numOfDTError = numOfDTError + item.errors.length;
      totalNumOfError = totalNumOfError + item.errors.length;
    });

    reports.segmentVerificationResults.forEach((item) => {
      numOfSEGError = numOfSEGError + item.errors.length;
      totalNumOfError = totalNumOfError + item.errors.length;
    });

    reports.conformanceProfileVerificationResults.forEach((item) => {
      numOfCPError = numOfCPError + item.errors.length;
      totalNumOfError = totalNumOfError + item.errors.length;
    });
    numOfIGError = numOfIGError + reports.igVerificationResult.errors.length;
    totalNumOfError = totalNumOfError + reports.igVerificationResult.errors.length;

    return [totalNumOfError, numOfVSError, numOfDTError, numOfSEGError, numOfCPError, numOfIGError];
  }
}
export interface IVerifyIgDialogData {
  igId: string;
}
