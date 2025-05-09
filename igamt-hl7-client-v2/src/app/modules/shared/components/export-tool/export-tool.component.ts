import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { throwError } from 'rxjs';
import { catchError, flatMap, map, take } from 'rxjs/operators';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { MessageType, UserMessage } from '../../../dam-framework/models/messages/message.class';
import { AddMessage, ClearAll } from '../../../dam-framework/store/messages/messages.actions';
import { IgService } from '../../../ig/services/ig.service';
import { Type } from '../../constants/type.enum';
import { IConnectingInfo } from '../../models/config.class';
import { IDisplayElement } from '../../models/display-element.interface';
import { StoreResourceRepositoryService } from '../../services/resource-repository.service';
import { VerificationService } from '../../services/verification.service';
import { ISelectedIds } from '../select-resource-ids/select-resource-ids.component';
import { IVerificationResultDisplay, VerificationDisplayActiveTypeSelector } from '../verification-result-display/verification-result-display.component';

@Component({
  selector: 'app-export-tool',
  templateUrl: './export-tool.component.html',
  styleUrls: ['./export-tool.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ExportToolComponent implements OnInit {
  step = 0;
  ids: ISelectedIds = { conformanceProfilesId: [], compositeProfilesId: [] };
  verificationResult: IVerificationResultDisplay;
  verificationInProgress = false;
  exportInProgress = false;
  verificationFailed = false;
  verificationErrorMessage: string;
  hasFatal = false;
  hasErrors = false;
  username: string;
  password: string;
  tool: IConnectingInfo;
  hasDomains = false;
  domains: any[];
  selectedToolScope: { domain: string };
  redirectUrl: string;
  HTMLErrorReport: string;
  exportError: string;
  exportFailed = false;
  activeSelector: VerificationDisplayActiveTypeSelector = (data) => {
    if (data.conformanceProfiles && data.conformanceProfiles.entries && data.conformanceProfiles.entries.length > 0) {
      return Type.CONFORMANCEPROFILE;
    }
    if (data.compositeProfiles && data.compositeProfiles.entries && data.compositeProfiles.entries.length > 0) {
      return Type.COMPOSITEPROFILE;
    }
    return undefined;
  }

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<ExportToolComponent>,
    private verificationService: VerificationService,
    private repository: StoreResourceRepositoryService,
    private message: MessageService,
    @Inject(MAT_DIALOG_DATA) public data: IExportToolDialogComponent,
    private igService: IgService,
    private store: Store<any>) {

  }

  back() {
    if (this.step !== 0) {
      switch (this.step) {
        case 1:
          this.selectedToolScope = undefined;
          this.ids = { conformanceProfilesId: [], compositeProfilesId: [] };
          break;
        case 2:
          this.ids = { conformanceProfilesId: [], compositeProfilesId: [] };
          this.verificationResult = undefined;
          this.verificationInProgress = false;
          this.verificationFailed = false;
          this.verificationErrorMessage = undefined;
          this.hasFatal = false;
          this.hasErrors = false;
          break;
        case 3:
          this.exportInProgress = false;
          this.redirectUrl = undefined;
          this.HTMLErrorReport = undefined;
          this.exportError = undefined;
          this.exportFailed = false;
          break;
      }
      this.step = this.step - 1;
    }
  }

  selectConformanceProfiles(ids: string[]) {
    this.ids = { ...this.ids, conformanceProfilesId: ids };
  }

  selectCompositeProfiles(ids: string[]) {
    this.ids = { ...this.ids, compositeProfilesId: ids };
  }

  verify() {
    this.step = 2;
    this.verificationInProgress = true;
    this.verificationFailed = false;
    this.verificationErrorMessage = '';
    this.http.post<any>('/api/igdocuments/' + this.data.igId + '/preverification', this.ids).pipe(
      flatMap((result) => {
        const report = result.verificationIssues;
        return this.verificationService.verificationReportToDisplay(report, this.repository).pipe(
          take(1),
          map((verificationResult) => {
            this.verificationResult = verificationResult;
            this.setVerificationFlags(verificationResult);
            this.verificationInProgress = false;
          }),
        );
      }),
      catchError((e) => {
        this.verificationInProgress = false;
        this.verificationFailed = true;
        this.verificationErrorMessage = this.message.fromError(e).message;
        this.step = 1;
        return throwError(e);
      }),
    ).subscribe();
  }

  setVerificationFlags(result: IVerificationResultDisplay) {
    const fatalCount = this.getCountOrZero(result.ig.stats.fatal)
      + this.getCountOrZero(result.compositeProfiles.stats.fatal)
      + this.getCountOrZero(result.conformanceProfiles.stats.fatal)
      + this.getCountOrZero(result.segments.stats.fatal)
      + this.getCountOrZero(result.datatypes.stats.fatal)
      + this.getCountOrZero(result.valueSets.stats.fatal)
      + this.getCountOrZero(result.coConstraintGroups.stats.fatal);

    const errorsCount = this.getCountOrZero(result.ig.stats.error)
      + this.getCountOrZero(result.compositeProfiles.stats.error)
      + this.getCountOrZero(result.conformanceProfiles.stats.error)
      + this.getCountOrZero(result.segments.stats.error)
      + this.getCountOrZero(result.datatypes.stats.error)
      + this.getCountOrZero(result.valueSets.stats.error)
      + this.getCountOrZero(result.coConstraintGroups.stats.error);

    this.hasErrors = errorsCount > 0;
    this.hasFatal = fatalCount > 0;
  }

  getCountOrZero(n?: number): number {
    return n || 0;
  }

  submit() {
    this.step = 3;
    this.store.dispatch(new fromDAM.TurnOnLoader({ blockUI: false }));
    this.exportInProgress = true;
    this.redirectUrl = undefined;
    this.HTMLErrorReport = undefined;
    this.exportError = undefined;
    this.exportFailed = false;
    this.igService.exportToTesting(this.data.igId, this.ids, this.username, this.password, this.tool, this.selectedToolScope.domain).subscribe(
      (response: any) => {
        this.store.dispatch(new fromDAM.TurnOffLoader());
        this.exportInProgress = false;
        if (response.token) {
          this.redirectUrl = this.tool.url + this.tool.redirectToken + '?x=' + encodeURIComponent(response.token) + '&y=' + encodeURIComponent(btoa(this.username + ':' + this.password)) + '&d=' + encodeURIComponent(this.selectedToolScope.domain);
          window.open(this.redirectUrl, '_blank');
        } else if (response.success === false) {
          this.HTMLErrorReport = response.report;
          this.exportError = response.message;
          this.exportFailed = true;
        }
      },
      (response: HttpErrorResponse) => {
        this.exportInProgress = false;
        this.store.dispatch(new fromDAM.TurnOffLoader());
        this.store.dispatch(new AddMessage(new UserMessage(MessageType.FAILED, response.error.text)));
      });
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
    if (this.selectedToolScope) {
      return ((this.ids.conformanceProfilesId && this.ids.conformanceProfilesId.length > 0) || (this.ids.compositeProfilesId && this.ids.compositeProfilesId.length > 0));
    } else {
      return false;
    }
  }

  selectDomain(scope) {
    this.selectedToolScope = scope;
  }

  ngOnInit() {
    this.step = 0;
  }

  cancel() {
    this.dialogRef.close();
  }
}
export interface IExportToolDialogComponent {

  conformanceProfiles?: IDisplayElement[];
  compositeProfiles?: IDisplayElement[];
  tools: IConnectingInfo[];
  igId: string;
}
