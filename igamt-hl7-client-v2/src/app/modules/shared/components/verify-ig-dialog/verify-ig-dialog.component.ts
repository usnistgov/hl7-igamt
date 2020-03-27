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
          item.errors.forEach((e) => {
            if(e.severity === 'FATAL') {
              numOfVSError[0] = numOfVSError[0] + 1;
            } else if(e.severity === 'ERROR') {
              numOfVSError[1] = numOfVSError[1] + 1;
            } else if(e.severity === 'WARNING') {
              numOfVSError[2] = numOfVSError[2] + 1;
            } else if(e.severity === 'INFO') {
              numOfVSError[3] = numOfVSError[3] + 1;
            }
          });
        });
      }

      if (reports.datatypeVerificationResults) {
        reports.datatypeVerificationResults.forEach((item) => {
          item.errors.forEach((e) => {
            if(e.severity === 'FATAL') {
              numOfDTError[0] = numOfDTError[0] + 1;
            } else if(e.severity === 'ERROR') {
              numOfDTError[1] = numOfDTError[1] + 1;
            } else if(e.severity === 'WARNING') {
              numOfDTError[2] = numOfDTError[2] + 1;
            } else if(e.severity === 'INFO') {
              numOfDTError[3] = numOfDTError[3] + 1;
            }
          });
        });
      }

      if (reports.segmentVerificationResults) {
        reports.segmentVerificationResults.forEach((item) => {
          item.errors.forEach((e) => {
            if(e.severity === 'FATAL') {
              numOfSEGError[0] = numOfSEGError[0] + 1;
            } else if(e.severity === 'ERROR') {
              numOfSEGError[1] = numOfSEGError[1] + 1;
            } else if(e.severity === 'WARNING') {
              numOfSEGError[2] = numOfSEGError[2] + 1;
            } else if(e.severity === 'INFO') {
              numOfSEGError[3] = numOfSEGError[3] + 1;
            }
          });
        });
      }

      if (reports.conformanceProfileVerificationResults) {
        reports.conformanceProfileVerificationResults.forEach((item) => {
          item.errors.forEach((e) => {
            if(e.severity === 'FATAL') {
              numOfCPError[0] = numOfCPError[0] + 1;
            } else if(e.severity === 'ERROR') {
              numOfCPError[1] = numOfCPError[1] + 1;
            } else if(e.severity === 'WARNING') {
              numOfCPError[2] = numOfCPError[2] + 1;
            } else if(e.severity === 'INFO') {
              numOfCPError[3] = numOfCPError[3] + 1;
            }
          });
        });
      }

      reports.igVerificationResult.errors.forEach((e) => {
        console.log(e);

        this.igVerificationResultTable.push(e);

        if(e.severity === 'FATAL') {
          numOfIGError[0] = numOfIGError[0] + 1;
        } else if(e.severity === 'ERROR') {
          numOfIGError[1] = numOfIGError[1] + 1;
        } else if(e.severity === 'WARNING') {
          numOfIGError[2] = numOfIGError[2] + 1;
        } else if(e.severity === 'INFO') {
          numOfIGError[3] = numOfIGError[3] + 1;
        }
      });
    }

    return [numOfVSError, numOfDTError, numOfSEGError, numOfCPError, numOfIGError];

  }
}
export interface IVerifyIgDialogData {
  igId: string;
  type: string;
}
