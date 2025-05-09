import { HttpClient } from '@angular/common/http';
import { Component, Inject, TemplateRef, ViewChild } from '@angular/core';
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

export enum ExportStepType {
  PROFILE_SELECTION = "PROFILE_SELECTION",
  VERIFICATION = "VERIFICATION",
  EXTERNAL_VALUESET_CONFIGURATION = "EXTERNAL_VALUESET_CONFIGURATION"
}

export enum ExternalValueSetExportType {
  EXTERNAL = "EXTERNAL",
  EXCLUDED = "EXCLUDED",
  SNAPSHOT = "SNAPSHOT"
}

@Component({
  selector: 'app-export-xml-dialog',
  templateUrl: './export-xml-dialog.component.html',
  styleUrls: ['./export-xml-dialog.component.css'],
})
export class ExportXmlDialogComponent {
  current = ExportStepType.PROFILE_SELECTION;
  ids: ISelectedIds = { conformanceProfilesId: [], compositeProfilesId: [] };
  verificationResult: IVerificationResultDisplay;
  externalValueSets: {
    display: IDisplayElement;
    URL: string;
  }[] = [];
  verificationInProgress = false;
  verificationFailed = false;
  verificationErrorMessage: string;
  verified = false;
  hasFatal = false;
  hasErrors = false;
  exportTypeMap = {};
  rememberExternalValueSetExportMode = false;
  externalValueSetsTypeCount = {
    external: 0,
    excluded: 0,
    snapshot: 0,
  };

  @ViewChild('profileSelection')
  profileSelection: TemplateRef<any>;
  @ViewChild('profileSelectionActions')
  profileSelectionActions: TemplateRef<any>;

  @ViewChild('profileVerification')
  profileVerification: TemplateRef<any>;
  @ViewChild('profileVerificationActions')
  profileVerificationActions: TemplateRef<any>;

  @ViewChild('externalValueSetsConfiguration')
  externalValueSetsConfiguration: TemplateRef<any>;
  @ViewChild('externalValueSetsConfigurationActions')
  externalValueSetsConfigurationActions: TemplateRef<any>;

  activeSelector: VerificationDisplayActiveTypeSelector = (data) => {
    if (data.conformanceProfiles && data.conformanceProfiles.entries && data.conformanceProfiles.entries.length > 0) {
      return Type.CONFORMANCEPROFILE;
    }
    if (data.compositeProfiles && data.compositeProfiles.entries && data.compositeProfiles.entries.length > 0) {
      return Type.COMPOSITEPROFILE;
    }
    return undefined;
  }

  getStepTemplate(step: ExportStepType) {
    switch (step) {
      case ExportStepType.PROFILE_SELECTION:
        return this.profileSelection;
      case ExportStepType.VERIFICATION:
        return this.profileVerification;
      case ExportStepType.EXTERNAL_VALUESET_CONFIGURATION:
        return this.externalValueSetsConfiguration;
    }
  }

  getStepActions(step: ExportStepType) {
    switch (step) {
      case ExportStepType.PROFILE_SELECTION:
        return this.profileSelectionActions;
      case ExportStepType.VERIFICATION:
        return this.profileVerificationActions;
      case ExportStepType.EXTERNAL_VALUESET_CONFIGURATION:
        return this.externalValueSetsConfigurationActions;
    }
  }

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<ExportXmlDialogComponent>,
    private verificationService: VerificationService,
    private repository: StoreResourceRepositoryService,
    private message: MessageService,
    @Inject(MAT_DIALOG_DATA) public data: IExportXmlDialogData) {

  }

  cancel() {
    this.dialogRef.close();
  }

  updateTypeCount() {
    if (!this.externalValueSets) {
      return;
    }
    let external = 0;
    let excluded = 0;
    let snapshot = 0;
    for (const evs of this.externalValueSets) {
      switch (this.exportTypeMap[evs.display.id]) {
        case 'EXCLUDED':
          excluded++;
          break;
        case 'SNAPSHOT':
          snapshot++;
          break;
        case 'EXTERNAL':
        default:
          external++;
      }
    }
    this.externalValueSetsTypeCount = {
      excluded,
      external,
      snapshot
    }
  }

  verify() {
    this.current = ExportStepType.VERIFICATION;
    this.verificationInProgress = true;
    this.verificationFailed = false;
    this.verificationErrorMessage = '';
    this.externalValueSets = [];
    this.verified = false;
    this.exportTypeMap = {};
    this.externalValueSetsTypeCount = {
      external: 0,
      excluded: 0,
      snapshot: 0,
    };
    this.http.post<any>('/api/igdocuments/' + this.data.igId + '/preverification', { ids: this.ids, exportType: 'xml' }).pipe(
      flatMap((result) => {
        const report = result.verificationIssues;
        const externalValueSetExportModes = result.externalValueSetExportModes || {};
        this.externalValueSets = result.externalValueSetReferences || [];
        return this.verificationService.verificationReportToDisplay(report, this.repository).pipe(
          take(1),
          map((verificationResult) => {
            this.verificationResult = verificationResult;
            this.setVerificationFlags(verificationResult);
            this.verificationInProgress = false;
            this.verified = true;
            this.exportTypeMap = {};
            for (const vs of this.externalValueSets) {
              this.exportTypeMap[vs.display.id] = externalValueSetExportModes[vs.display.id];
            }
            this.updateTypeCount();
          }),
        );
      }),
      catchError((e) => {
        this.verificationInProgress = false;
        this.verificationFailed = true;
        this.verificationErrorMessage = this.message.fromError(e).message;
        this.externalValueSets = [];
        this.verified = false;
        this.current = ExportStepType.PROFILE_SELECTION;
        this.exportTypeMap = {};
        return throwError(e);
      }),
    ).subscribe();
  }

  configureExternalValueSets() {
    this.current = ExportStepType.EXTERNAL_VALUESET_CONFIGURATION;
  }

  setExportType(id: string, type: ExternalValueSetExportType) {
    this.exportTypeMap[id] = type;
    this.updateTypeCount();
  }

  setAllExportType(type: ExternalValueSetExportType) {
    this.exportTypeMap = {};
    for (const vs of this.externalValueSets) {
      this.exportTypeMap[vs.display.id] = type;
    }
    this.updateTypeCount();
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
    this.dialogRef.close({
      selected: this.ids,
      externalValueSetsExportMode: this.exportTypeMap,
      rememberExternalValueSetExportMode: this.rememberExternalValueSetExportMode,
    });
  }
  selectConformanceProfiles(ids: string[]) {
    this.ids = { ...this.ids, conformanceProfilesId: ids };
  }

  selectCompositeProfiles(ids: string[]) {
    this.ids = { ...this.ids, compositeProfilesId: ids };
  }

  goto(to: ExportStepType) {
    this.current = to;
  }
}
export interface IExportXmlDialogData {
  conformanceProfiles?: IDisplayElement[];
  compositeProfiles?: IDisplayElement[];
  igId?: string;
}
