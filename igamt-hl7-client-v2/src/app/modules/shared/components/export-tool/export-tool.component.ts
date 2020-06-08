import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { MessageType, UserMessage } from '../../../dam-framework/models/messages/message.class';
import { AddMessage, ClearAll } from '../../../dam-framework/store/messages/messages.actions';
import { IgService } from '../../../ig/services/ig.service';
import { IConnectingInfo } from '../../models/config.class';
import { IDisplayElement } from '../../models/display-element.interface';
import { ISelectedIds } from '../select-resource-ids/select-resource-ids.component';

@Component({
  selector: 'app-export-tool',
  templateUrl: './export-tool.component.html',
  styleUrls: ['./export-tool.component.css'],
})
export class ExportToolComponent implements OnInit {
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
  ids: ISelectedIds = { conformanceProfilesId: [], compositeProfilesId: [] };
  username: string;
  password: string;
  tool: IConnectingInfo;
  hasDomains = false;
  domains: any[];
  selectedDomain: string;
  redirectUrl: string;
  errors: any = null;
  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<ExportToolComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IExportToolDialogComponent,
    private igService: IgService,
    private store: Store<any>) {

  }
  ngOnInit() {
    this.reports = null;
    this.errorCounts = null;
    this.step = 0;
  }
  cancel() {
    this.dialogRef.close();
  }
  submit() {
    this.step = 3;
    this.store.dispatch(new fromDAM.TurnOnLoader({ blockUI: false }));

    this.igService.exportToTesting(this.data.igId, this.ids, this.username, this.password, this.tool, this.selectedDomain).subscribe(
      (x: any) => {
        console.log(x);
        this.store.dispatch(new fromDAM.TurnOffLoader());
        if (x.token) {
          this.redirectUrl = this.tool.url + this.tool.redirectToken + '?x=' + encodeURIComponent(x.token) + '&y=' + encodeURIComponent(btoa(this.username + ':' + this.password)) + '&d=' + encodeURIComponent(this.selectedDomain);
          console.log(this.redirectUrl);
          window.open(this.redirectUrl, '_blank');
        } else if (x.success === false && x.report) {
          this.errors = x.report;
        }
      },
      (response: HttpErrorResponse) => {
        console.log(response.error.text);
        this.store.dispatch(new fromDAM.TurnOffLoader());
        this.store.dispatch(new AddMessage(new UserMessage(MessageType.FAILED, response.error.text)));
      });
  }
  matchId($event: ISelectedIds) {
    this.ids = $event;
  }
  loadDomain() {
    this.hasDomains = false;
    this.store.dispatch(new fromDAM.TurnOnLoader({ blockUI: false }));
    this.igService.loadDomain(this.username, this.password, this.tool).subscribe((x) => {
      this.domains = x;
      this.hasDomains = true;
      this.store.dispatch(new fromDAM.TurnOffLoader());
      this.store.dispatch(new ClearAll());
      this.step = 1;
    }, (response: HttpErrorResponse) => {
      this.hasDomains = false;

      this.store.dispatch(new fromDAM.TurnOffLoader());
      this.store.dispatch(new AddMessage(new UserMessage(MessageType.FAILED, response.error.text)));
    });
  }
  isSelected(): boolean {
    return (this.ids.conformanceProfilesId && this.ids.conformanceProfilesId.length > 0) || (this.ids.compositeProfilesId && this.ids.compositeProfilesId.length > 0);
  }
  selectDomain($event) {
    console.log($event);
    this.selectedDomain = $event.value.domain;
    console.log(this.selectedDomain);
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

  verify() {
    this.step = 2;
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
}
export interface IExportToolDialogComponent {

  conformanceProfiles?: IDisplayElement[];
  compositeProfiles?: IDisplayElement[];
  tools: IConnectingInfo[];
  igId: string;
}
