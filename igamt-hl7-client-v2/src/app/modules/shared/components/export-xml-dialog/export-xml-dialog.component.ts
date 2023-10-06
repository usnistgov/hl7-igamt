import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { throwError } from 'rxjs';
import { catchError, flatMap, map, take } from 'rxjs/operators';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import { Type } from '../../constants/type.enum';
import { IDisplayElement } from '../../models/display-element.interface';
import { StoreResourceRepositoryService } from '../../services/resource-repository.service';
import { VerificationService } from '../../services/verification.service';
import { ISelectedIds } from '../select-resource-ids/select-resource-ids.component';
import { IVerificationResultDisplay, VerificationDisplayActiveTypeSelector } from '../verification-result-display/verification-result-display.component';

@Component({
  selector: 'app-export-xml-dialog',
  templateUrl: './export-xml-dialog.component.html',
  styleUrls: ['./export-xml-dialog.component.css'],
})
export class ExportXmlDialogComponent implements OnInit {
  step = 0;
  ids: ISelectedIds = { conformanceProfilesId: [], compositeProfilesId: [] };
  verificationResult: IVerificationResultDisplay;
  verificationInProgress = false;
  verificationFailed = false;
  verificationErrorMessage: string;
  hasFatal = false;
  hasErrors = false;
  activeSelector: VerificationDisplayActiveTypeSelector = (data) => {
    if (data.conformanceProfiles && data.conformanceProfiles.entries && data.conformanceProfiles.entries.length > 0) {
      return Type.CONFORMANCEPROFILE;
    }
    if (data.compositeProfiles && data.compositeProfiles.entries && data.compositeProfiles.entries.length > 0) {
      return Type.COMPOSITEPROFILE;
    }
    return Type.CONFORMANCEPROFILE;
  }

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<ExportXmlDialogComponent>,
    private verificationService: VerificationService,
    private repository: StoreResourceRepositoryService,
    private message: MessageService,
    @Inject(MAT_DIALOG_DATA) public data: IExportXmlDialogData) {

  }
  ngOnInit() {
    this.step = 0;
  }

  cancel() {
    this.dialogRef.close();
  }

  verify() {
    this.step = 1;
    this.verificationInProgress = true;
    this.verificationFailed = false;
    this.verificationErrorMessage = '';
    this.http.post<any>('/api/igdocuments/' + this.data.igId + '/preverification', this.ids).pipe(
      flatMap((report) => {
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
        this.step = 0;
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
    this.dialogRef.close(this.ids);
  }
  selectConformanceProfiles(ids: string[]) {
    this.ids = { ...this.ids, conformanceProfilesId: ids };
  }

  selectCompositeProfiles(ids: string[]) {
    this.ids = { ...this.ids, compositeProfilesId: ids };
  }
}
export interface IExportXmlDialogData {
  conformanceProfiles?: IDisplayElement[];
  compositeProfiles?: IDisplayElement[];
  igId?: string;
}
