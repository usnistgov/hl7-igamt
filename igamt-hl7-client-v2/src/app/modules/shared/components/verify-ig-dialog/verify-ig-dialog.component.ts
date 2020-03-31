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
  errorCounts: number[][];
  igVerificationResultTable: any[] = [];
  constructor(private http: HttpClient, public dialogRef: MatDialogRef<VerifyIgDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IVerifyIgDialogData) {
    this.reports = null;
  }
  ngOnInit() {
    this.reports = null;
    this.errorCounts = [];
    console.log(this.data);

    if (this.data && this.data.igId) {
      if (this.data.type === 'Verification') {
        this.http.get<any[]>('/api/igdocuments/' + this.data.igId + '/verification').subscribe((x) => {
          this.reports = x;
          this.errorCounts = this.countErrors(this.reports);
        });
      } else if (this.data.type === 'Compliance') {
        this.http.get<any[]>('/api/igdocuments/' + this.data.igId + '/compliance').subscribe((x) => {
          this.reports = x;
        });
      }
    }

  }
  cancel() {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close();
  }

  addErrorNumbers(numOfError, errors) {
    errors.forEach((e) => {
      if (e.severity === 'FATAL') {
        numOfError[0] = numOfError[0] + 1;
      } else if (e.severity === 'ERROR') {
        numOfError[1] = numOfError[1] + 1;
      } else if (e.severity === 'WARNING') {
        numOfError[2] = numOfError[2] + 1;
      } else if (e.severity === 'INFO') {
        numOfError[3] = numOfError[3] + 1;
      }
    });

    return numOfError;
  }

  countErrors(reports) {
    let numOfVSError = [0, 0, 0, 0];
    let numOfDTError = [0, 0, 0, 0];
    let numOfSEGError = [0, 0, 0, 0];
    let numOfCPError = [0, 0, 0, 0];
    let numOfIGError = [0, 0, 0, 0];

    this.igVerificationResultTable = [];

    if (reports) {
      if (reports.valuesetVerificationResults) {
        reports.valuesetVerificationResults.forEach((item) => {
          numOfVSError = this.addErrorNumbers(numOfVSError, item.errors);
        });
      }

      if (reports.datatypeVerificationResults) {
        reports.datatypeVerificationResults.forEach((item) => {
          numOfDTError = this.addErrorNumbers(numOfDTError, item.errors);
        });
      }

      if (reports.segmentVerificationResults) {
        reports.segmentVerificationResults.forEach((item) => {
          numOfSEGError = this.addErrorNumbers(numOfSEGError, item.errors);
        });
      }

      if (reports.conformanceProfileVerificationResults) {
        reports.conformanceProfileVerificationResults.forEach((item) => {
          numOfCPError = this.addErrorNumbers(numOfCPError, item.errors);
        });
      }

      numOfIGError = this.addErrorNumbers(numOfIGError, reports.igVerificationResult.errors);
    }

    return [numOfVSError, numOfDTError, numOfSEGError, numOfCPError, numOfIGError];

  }
}
export interface IVerifyIgDialogData {
  igId: string;
  type: string;
}
