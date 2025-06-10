import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { Subscription, throwError } from 'rxjs';
import { catchError, flatMap, map, take } from 'rxjs/operators';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { IgService } from '../../../ig/services/ig.service';
import { Type } from '../../constants/type.enum';
import { IConnectingInfo } from '../../models/config.class';
import { IDisplayElement } from '../../models/display-element.interface';
import { StoreResourceRepositoryService } from '../../services/resource-repository.service';
import { VerificationService } from '../../services/verification.service';
import { ExternalValueSetExportType } from '../export-xml-dialog/export-xml-dialog.component';
import { ISelectedIds } from '../select-resource-ids/select-resource-ids.component';
import { IVerificationResultDisplay, VerificationDisplayActiveTypeSelector } from '../verification-result-display/verification-result-display.component';

export enum ToolExportStepType {
  TOOL_LOGIN = 'TOOL_LOGIN',
  PROFILE_SELECTION = 'PROFILE_SELECTION',
  VERIFICATION = 'VERIFICATION',
  EXTERNAL_VALUESET_CONFIGURATION = 'EXTERNAL_VALUESET_CONFIGURATION',
  BUNDLE_GENERATION = 'BUNDLE_GENERATION',
}

@Component({
  selector: 'app-export-tool',
  templateUrl: './export-tool.component.html',
  styleUrls: ['./export-tool.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ExportToolComponent implements OnInit {

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
  current = ToolExportStepType.PROFILE_SELECTION;
  ids: ISelectedIds = { conformanceProfilesId: [], compositeProfilesId: [] };
  verificationResult: IVerificationResultDisplay;
  externalValueSets: Array<{
    display: IDisplayElement;
    URL: string;
  }> = [];
  verificationInProgress = false;
  verificationFailed = false;
  verificationErrorMessage: string;
  generationInProgress = false;
  generationFailed = false;
  generationErrorMessage: string;
  verified = false;
  hasFatal = false;
  hasErrors = false;
  exportTypeMap = {};
  exportType = '';
  rememberExternalValueSetExportMode = false;
  externalValueSetsTypeCount = {
    external: 0,
    excluded: 0,
    snapshot: 0,
  };
  generationSubscription: Subscription;
  displayTable = false;
  username: string;
  password: string;
  tool: IConnectingInfo;
  hasDomains = false;
  domainsError = '';
  domains: any[];
  selectedToolScope: { domain: string };
  redirectUrl: string;
  HTMLErrorReport: string;
  exportInProgress = false;
  exportError: string;
  exportFailed = false;

  @ViewChild('toolLogin')
  toolLogin: TemplateRef<any>;
  @ViewChild('toolLoginActions')
  toolLoginActions: TemplateRef<any>;

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

  @ViewChild('bundleGeneration')
  bundleGeneration: TemplateRef<any>;
  @ViewChild('bundleGenerationActions')
  bundleGenerationActions: TemplateRef<any>;
  activeSelector: VerificationDisplayActiveTypeSelector = (data) => {
    if (data.conformanceProfiles && data.conformanceProfiles.entries && data.conformanceProfiles.entries.length > 0) {
      return Type.CONFORMANCEPROFILE;
    }
    if (data.compositeProfiles && data.compositeProfiles.entries && data.compositeProfiles.entries.length > 0) {
      return Type.COMPOSITEPROFILE;
    }
    return undefined;
  }

  getStepTemplate(step: ToolExportStepType) {
    switch (step) {
      case ToolExportStepType.TOOL_LOGIN:
        return this.toolLogin;
      case ToolExportStepType.PROFILE_SELECTION:
        return this.profileSelection;
      case ToolExportStepType.VERIFICATION:
        return this.profileVerification;
      case ToolExportStepType.EXTERNAL_VALUESET_CONFIGURATION:
        return this.externalValueSetsConfiguration;
      case ToolExportStepType.BUNDLE_GENERATION:
        return this.bundleGeneration;
    }
  }

  getStepActions(step: ToolExportStepType) {
    switch (step) {
      case ToolExportStepType.TOOL_LOGIN:
        return this.toolLoginActions;
      case ToolExportStepType.PROFILE_SELECTION:
        return this.profileSelectionActions;
      case ToolExportStepType.VERIFICATION:
        return this.profileVerificationActions;
      case ToolExportStepType.EXTERNAL_VALUESET_CONFIGURATION:
        return this.externalValueSetsConfigurationActions;
      case ToolExportStepType.BUNDLE_GENERATION:
        return this.bundleGenerationActions;
    }
  }

  cancel() {
    if (this.generationSubscription) {
      this.generationSubscription.unsubscribe();
    }
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
      snapshot,
    };
  }

  verify() {
    this.current = ToolExportStepType.VERIFICATION;
    this.verificationInProgress = true;
    this.verificationFailed = false;
    this.verificationErrorMessage = '';
    this.generationInProgress = false;
    this.generationFailed = false;
    this.generationErrorMessage = '';
    this.externalValueSets = [];
    this.verified = false;
    this.exportTypeMap = {};
    this.externalValueSetsTypeCount = {
      external: 0,
      excluded: 0,
      snapshot: 0,
    };
    this.http.post<any>('/api/igdocuments/' + this.data.igId + '/preverification', { ids: this.ids, exportType: this.tool.label }).pipe(
      flatMap((result) => {
        const report = result.verificationIssues;
        const externalValueSetExportModes = result.externalValueSetExportModes || {};
        this.externalValueSets = result.externalValueSetReferences || [];
        return this.verificationService.verificationReportToDisplay(report, this.repository).pipe(
          take(1),
          map((verificationResult) => {
            this.verificationResult = verificationResult;
            this.displayTable = !this.tableIsEmpty(verificationResult);
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
        this.current = ToolExportStepType.PROFILE_SELECTION;
        this.exportTypeMap = {};
        return throwError(e);
      }),
    ).subscribe();
  }

  tableIsEmpty(verificationTable: IVerificationResultDisplay) {
    const ig = !verificationTable.ig || verificationTable.ig.entries.length === 0;
    const cp = !verificationTable.conformanceProfiles || verificationTable.conformanceProfiles.entries.length === 0;
    const composite = !verificationTable.compositeProfiles || verificationTable.compositeProfiles.entries.length === 0;
    const segments = !verificationTable.segments || verificationTable.segments.entries.length === 0;
    const datatypes = !verificationTable.datatypes || verificationTable.datatypes.entries.length === 0;
    const valueSets = !verificationTable.valueSets || verificationTable.valueSets.entries.length === 0;
    const coConstraintGroups = !verificationTable.coConstraintGroups || verificationTable.coConstraintGroups.entries.length === 0;
    return ig && cp && composite && segments && datatypes && valueSets && coConstraintGroups;
  }

  configureExternalValueSets() {
    this.current = ToolExportStepType.EXTERNAL_VALUESET_CONFIGURATION;
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
    this.current = ToolExportStepType.BUNDLE_GENERATION;
    this.exportInProgress = true;
    this.redirectUrl = undefined;
    this.HTMLErrorReport = undefined;
    this.exportError = undefined;
    this.exportFailed = false;
    this.generationSubscription = this.igService.exportToTesting(
      this.data.igId,
      this.ids,
      this.tool.label,
      {
        externalValueSetsExportMode: this.exportTypeMap,
        rememberExternalValueSetExportMode: this.rememberExternalValueSetExportMode,
      },
      this.username,
      this.password,
      this.tool,
      this.selectedToolScope.domain,
    ).subscribe(
      (response: any) => {
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
        this.exportError = response.error.text;
        this.exportFailed = true;
      });
  }

  backFromGeneration() {
    if (this.generationSubscription) {
      this.generationSubscription.unsubscribe();
    }
    this.goto(ToolExportStepType.VERIFICATION);
  }

  goto(to: ToolExportStepType) {
    this.current = to;
  }

  selectConformanceProfiles(ids: string[]) {
    this.ids = { ...this.ids, conformanceProfilesId: ids };
  }

  selectCompositeProfiles(ids: string[]) {
    this.ids = { ...this.ids, compositeProfilesId: ids };
  }

  loadDomain() {
    this.hasDomains = false;
    this.domainsError = '';
    this.store.dispatch(new fromDAM.TurnOnLoader({ blockUI: false }));
    this.igService.loadDomain(this.username, this.password, this.tool).subscribe((x) => {
      this.domains = x;
      this.exportType = this.tool.label;
      this.hasDomains = true;
      this.store.dispatch(new fromDAM.TurnOffLoader());
      this.current = ToolExportStepType.PROFILE_SELECTION;
    }, (response: HttpErrorResponse) => {
      this.hasDomains = false;
      this.domainsError = response.error.text;
      this.store.dispatch(new fromDAM.TurnOffLoader());
    }, () => {
      this.store.dispatch(new fromDAM.TurnOffLoader());
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
    this.current = ToolExportStepType.TOOL_LOGIN;
  }

}
export interface IExportToolDialogComponent {

  conformanceProfiles?: IDisplayElement[];
  compositeProfiles?: IDisplayElement[];
  tools: IConnectingInfo[];
  igId: string;
}
