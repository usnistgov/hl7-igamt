import { HttpClient } from '@angular/common/http';
import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {SelectItem} from 'primeng/api';
import {IDisplayElement} from '../../models/display-element.interface';
import {ISelectedIds} from '../select-resource-ids/select-resource-ids.component';

@Component({
  selector: 'app-export-xml-dialog',
  templateUrl: './export-xml-dialog.component.html',
  styleUrls: ['./export-xml-dialog.component.css'],
})
export class ExportXmlDialogComponent implements OnInit {
  step = 0;
  reports: any;
  errorCounts: number[][];
  igVerificationResultTable: any[] = [];
  cpVerificationResultTable: any[] = [];
  segVerificationResultTable: any[] = [];
  dtVerificationResultTable: any[] = [];
  vsVerificationResultTable: any[] = [];
  igVerificationResultTableForUser: any[] = [];
  cpVerificationResultTableForUser: any[] = [];
  segVerificationResultTableForUser: any[] = [];
  dtVerificationResultTableForUser: any[] = [];
  vsVerificationResultTableForUser: any[] = [];
  ids: ISelectedIds = {conformanceProfilesId: [], compositeProfilesId: []};
  severities: SelectItem[];

  constructor(private http: HttpClient, public dialogRef: MatDialogRef<ExportXmlDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IExportXmlDialogData) {

  }
  ngOnInit() {
    this.severities = [
      { label: 'All Severities', value: null },
      { label: 'FATAL', value: 'FATAL' },
      { label: 'ERROR', value: 'ERROR' },
      { label: 'WARNING', value: 'WARNING' },
      { label: 'INFO', value: 'INFO' },
    ];
    this.reports = null;
    this.errorCounts = null;
    this.step = 0;
  }
  cancel() {
    this.dialogRef.close();
  }

  verify() {
    this.step = 1;
    this.http.post<any>('/api/igdocuments/' + this.data.igId + '/preverification', this.ids).pipe().subscribe(
        (x) => {
          this.reports = x;
          this.errorCounts = this.countErrors(this.reports);

          console.log(x);
        },
        (error) => {
        },
    );
  }

  addErrorNumbers(errorTable, errorTableForUser, numOfError, errors) {
    errors.forEach((e) => {
      if (e && e.targetMeta && e.targetMeta.domainInfo && e.targetMeta.domainInfo.scope === 'USER' && e.handleBy === 'User') {
        errorTableForUser.push(e);
      } else {
        errorTable.push(e);
      }

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
    this.cpVerificationResultTable = [];
    this.segVerificationResultTable = [];
    this.dtVerificationResultTable = [];
    this.vsVerificationResultTable = [];

    if (reports) {
      if (reports.valuesetVerificationResults) {
        reports.valuesetVerificationResults.forEach((item) => {
          numOfVSError = this.addErrorNumbers(this.vsVerificationResultTable, this.vsVerificationResultTableForUser, numOfVSError, item.errors);
        });
      }

      if (reports.datatypeVerificationResults) {
        reports.datatypeVerificationResults.forEach((item) => {
          numOfDTError = this.addErrorNumbers(this.dtVerificationResultTable, this.dtVerificationResultTableForUser, numOfDTError, item.errors);
        });
      }

      if (reports.segmentVerificationResults) {
        reports.segmentVerificationResults.forEach((item) => {
          numOfSEGError = this.addErrorNumbers(this.segVerificationResultTable, this.segVerificationResultTableForUser, numOfSEGError, item.errors);
        });
      }

      if (reports.conformanceProfileVerificationResults) {
        reports.conformanceProfileVerificationResults.forEach((item) => {
          numOfCPError = this.addErrorNumbers(this.cpVerificationResultTable, this.cpVerificationResultTableForUser, numOfCPError, item.errors);
        });
      }

      numOfIGError = this.addErrorNumbers(this.igVerificationResultTable, this.igVerificationResultTableForUser, numOfIGError, reports.igVerificationResult.errors);
    }

    return [numOfVSError, numOfDTError, numOfSEGError, numOfCPError, numOfIGError];

  }

  submit() {
    this.dialogRef.close(this.ids);
  }
  matchProfileIds($event: string[]) {
    this.ids = {...this.ids, conformanceProfilesId: $event };
  }
  isSelected(): boolean {
    return (this.ids.conformanceProfilesId && this.ids.conformanceProfilesId.length > 0) || ( this.ids.compositeProfilesId && this.ids.compositeProfilesId.length > 0);
  }

  isProcessable(): boolean {
    if (this.errorCounts && this.errorCounts[0] && this.errorCounts[1] && this.errorCounts[2] && this.errorCounts[3] && this.errorCounts[4] &&
            this.errorCounts[0][0] + this.errorCounts[0][1]
          + this.errorCounts[1][1] + this.errorCounts[1][1]
          + this.errorCounts[2][1] + this.errorCounts[2][1]
          + this.errorCounts[3][1] + this.errorCounts[3][1]
          + this.errorCounts[4][1] + this.errorCounts[4][1] === 0) {
        return true;
    }
    return false;
  }
}
export interface IExportXmlDialogData {
  conformanceProfiles?: IDisplayElement[];
  compositeProfiles?: IDisplayElement[];
  igId?: string;
}
