import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import * as moment from 'moment';
import { combineLatest, concat, EMPTY, interval, Observable, of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { IVerificationEnty } from '../../dam-framework';
import { selectWorkspaceActive, selectWorkspaceVerification } from '../../dam-framework/store';
import { IIgVerificationReport } from '../../ig/models/ig/ig-document.class';
import { IResourceKey } from '../components/hl7-v2-tree/hl7-v2-tree.component';
import { IVerificationResultDisplay } from '../components/verification-result-display/verification-result-display.component';
import { Type } from '../constants/type.enum';
import { IDisplayElement } from '../models/display-element.interface';
import { Severity } from '../models/verification.interface';
import { AResourceRepositoryService } from './resource-repository.service';

export enum VerificationTab {
  IG = 'IG',
  EDITOR = 'EDITOR',
}

export interface IVerificationStats {
  informational?: number;
  error?: number;
  fatal?: number;
  warning?: number;
  total: number;
}

export interface IStatusBarInfo {
  supported: boolean;
  checked: boolean;
  loading: boolean;
  failed: boolean;
  lastUpdate$?: Observable<string>;
  title: string;
  stats?: IVerificationStats;
  valid: boolean;
}

export interface IStatusBar {
  activeEditor?: IStatusBarInfo;
  ig?: IStatusBarInfo;
}

export interface IVerificationEntryTable {
  valid: boolean;
  stats: IVerificationStats;
  resources: IDisplayElement[];
  codes: string[];
  severities: string[];
  entries: IVerificationEntryList[];
}

export interface IVerificationEntryList {
  target: IDisplayElement;
  subTarget?: IDisplayElement;
  stats: IVerificationStats;
  entries: IVerificationEnty[];
}

export interface IVerificationTabData {
  table: IVerificationEntryTable;
  failed: boolean;
  failure?: string;
}

@Injectable({
  providedIn: 'root',
})
export class VerificationService {

  constructor(private http: HttpClient, private store: Store<any>) { }

  getStatusBarActive(): Observable<boolean> {
    return this.getStatusBarTabs().pipe(
      map((tabs) => {
        return tabs && tabs.length > 0;
      }),
    );
  }

  getStatusBarTabs(): Observable<VerificationTab[]> {
    return combineLatest(
      this.store.select(selectWorkspaceVerification),
    ).pipe(
      map(([activeEditor]) => {
        return [
          ...(activeEditor && (!activeEditor.verificationTime || activeEditor.supported)) ? [VerificationTab.EDITOR] : [],
        ];
      }),
    );
  }

  getBottomDrawerActive(): Observable<boolean> {
    return this.getStatusBarActive()
      .pipe(
        flatMap((active) => {
          if (active) {
            return this.getBottomDrawerTabs().pipe(
              map((tabs) => {
                return tabs && tabs.length > 0;
              }),
            );
          } else {
            return of(false);
          }
        }),
      );
  }

  getBottomDrawerTabs(): Observable<VerificationTab[]> {
    return combineLatest(
      this.store.select(selectWorkspaceVerification),
    ).pipe(
      map(([activeEditor]) => {
        return [
          ...(activeEditor && (activeEditor.entries && activeEditor.entries.length > 0) || (activeEditor.failed && activeEditor.failure)) ? [VerificationTab.EDITOR] : [],
        ];
      }),
    );
  }

  getStatusBarInfo(): Observable<IStatusBar> {
    return combineLatest(
      this.getEditorStatusBarInfo(),
    ).pipe(
      map(([activeEditor]) => {
        return {
          activeEditor,
        };
      }),
    );
  }

  getEditorStatusBarInfo(): Observable<IStatusBarInfo> {
    return combineLatest(
      this.store.select(selectWorkspaceActive),
      this.store.select(selectWorkspaceVerification),
    ).pipe(
      map(([active, verification]) => {
        const supported = verification.supported;
        const checked = !!verification.verificationTime;
        const stats = this.getVerificationStats(verification.entries || []);
        return {
          supported,
          checked,
          loading: verification.loading,
          failed: verification.failed,
          valid: this.isValid(stats),
          stats,
          title: active.editor.title + ' Editor',
          lastUpdate$: verification.verificationTime ? concat(
            of('just now'),
            interval(5000).pipe(
              map(() => {
                const a = (moment as any)(verification.verificationTime);
                const b = (moment as any)(new Date());
                return a.from(b);
              }),
            ),
          ) : EMPTY,
        };
      }),
    );
  }

  isValid(stats: IVerificationStats): boolean {
    return !stats || !(stats.error || stats.warning || stats.informational || stats.warning || stats.fatal);
  }

  getVerificationStats(entry: IVerificationEnty[]): IVerificationStats {
    const error = entry.filter((e) => e.severity === Severity.ERROR).length;
    const informational = entry.filter((e) => e.severity === Severity.INFORMATIONAL).length;
    const fatal = entry.filter((e) => e.severity === Severity.FATAL).length;
    const warning = entry.filter((e) => e.severity === Severity.WARNING).length;
    return {
      error,
      informational,
      fatal,
      warning,
      total: error + informational + fatal + warning,
    };
  }

  getVerificationStatsFromIgVerificationReport(report: IIgVerificationReport): IVerificationStats {
    const entries = this.igVerificationReportToIssueList(report);
    const error = entries.filter((e) => e.severity === Severity.ERROR).length;
    const informational = entries.filter((e) => e.severity === Severity.INFORMATIONAL).length;
    const fatal = entries.filter((e) => e.severity === Severity.FATAL).length;
    const warning = entries.filter((e) => e.severity === Severity.WARNING).length;
    return {
      error,
      informational,
      fatal,
      warning,
      total: error + informational + fatal + warning,
    };
  }

  getEntryTable(tab: VerificationTab, repository: AResourceRepositoryService): Observable<IVerificationEntryTable> {
    if (tab === VerificationTab.EDITOR) {
      return this.getEditorVerificationEntryTable(repository);
    }

    return of(undefined);
  }

  getVerificationTabData(tab: VerificationTab, repository: AResourceRepositoryService): Observable<IVerificationTabData> {
    if (tab === VerificationTab.EDITOR) {
      return combineLatest(
        this.getEditorVerificationEntryTable(repository),
        this.store.select(selectWorkspaceVerification),
      ).pipe(
        map(([table, verification]) => ({
          table,
          failed: verification.failed,
          failure: verification.failure,
        })),
      );
    }

    return of(undefined);
  }

  getEditorVerificationEntryTable(repository: AResourceRepositoryService): Observable<IVerificationEntryTable> {
    return this.store.select(selectWorkspaceVerification).pipe(
      flatMap((verification) => {
        return verification.supported ? this.getVerificationEntryTable([], verification.entries || [], repository) : of(undefined);
      }),
    );
  }

  getEntryDisplayElement(generatedList: IDisplayElement[], id: string, type: Type, repository: AResourceRepositoryService): Observable<IDisplayElement> {
    if (type === Type.IGDOCUMENT) {
      return of(undefined);
    }
    const generated = generatedList && generatedList.find((element) => element.id === id && element.type === type);
    if (generated) {
      return of(generated);
    }
    return repository.getResourceDisplay(type, id);
  }

  private keyToStr(id: string, type: string): string {
    return `${id}@${type}`;
  }

  getAllResourceRefs(entries: IVerificationEnty[]): IResourceKey[] {
    return Object.values(entries.reduce((acc, entry) => {
      const target: IResourceKey = {
        id: entry.targetId,
        type: entry.targetType as Type,
      };
      const subTarget: IResourceKey = entry.subTarget;
      return {
        ...acc,
        [this.keyToStr(target.id, target.type)]: target,
        ...(subTarget ? { [this.keyToStr(subTarget.id, subTarget.type)]: subTarget } : {}),
      };
    }, {} as Record<string, IResourceKey>));
  }

  getVerificationEntryTable(generated: IDisplayElement[], entries: IVerificationEnty[], repository: AResourceRepositoryService): Observable<IVerificationEntryTable> {
    if (!entries || entries.length === 0) {
      return of({
        valid: true,
        stats: {
          informational: 0,
          error: 0,
          fatal: 0,
          warning: 0,
          total: 0,
        },
        resources: [],
        codes: [],
        severities: [],
        entries: [],
      });
    }

    const stats = this.getVerificationStats(entries);
    const codes = Array.from(new Set(entries.map((entry) => entry.code)));
    const severities = Array.from(new Set(entries.map((entry) => entry.severity)));
    const resourceKeys = this.getAllResourceRefs(entries);
    return combineLatest(
      resourceKeys.map((key) => this.getEntryDisplayElement(generated, key.id, key.type, repository)),
    ).pipe(
      map((resources) => {
        const entriesByGroupId = _.groupBy(entries, (entry) => this.getEntryGroupId(entry));
        const groupedEntryList = this.createEntryGroups(resources, entries, entriesByGroupId);

        return {
          valid: !(stats.error && stats.error > 0) && !(stats.fatal && stats.fatal > 0),
          stats,
          resources,
          codes,
          severities,
          entries: groupedEntryList,
        };
      }),
    );
  }

  createEntryGroups(resources: IDisplayElement[], entries: IVerificationEnty[], entriesByGroupId: Record<string, IVerificationEnty[]>): IVerificationEntryList[] {
    return Object.values(entries.reduce((acc, entry) => {
      const entryGroupId = this.getEntryGroupId(entry);
      if (acc[entryGroupId]) { return acc; }
      return {
        ...acc,
        [entryGroupId]: {
          target: resources.find((resource) => resource && this.keyToStr(resource.id, resource.type) === this.getEntryTargetResourceId(entry)),
          subTarget: entry.subTarget ? resources.find((resource) => resource && this.keyToStr(resource.id, resource.type) === this.getEntrySubTargetResourceId(entry)) : undefined,
          stats: this.getVerificationStats(entriesByGroupId[entryGroupId]),
          entries: entriesByGroupId[entryGroupId],
        },
      };
    }, {} as Record<string, IVerificationEntryList>));
  }

  getEntryTargetResourceId(entry: IVerificationEnty): string {
    return this.keyToStr(entry.targetId, entry.targetType);
  }
  getEntrySubTargetResourceId(entry: IVerificationEnty): string {
    return entry.subTarget ? this.keyToStr(entry.subTarget.id, entry.subTarget.type) : '';
  }
  getEntryGroupId(entry: IVerificationEnty): string {
    return this.getEntryTargetResourceId(entry) + (entry.subTarget ? '|' + this.getEntrySubTargetResourceId(entry) : '');
  }

  verificationReportToDisplay(report: IIgVerificationReport, repository: AResourceRepositoryService): Observable<IVerificationResultDisplay> {
    return combineLatest(
      this.convertIssueListToVerificationEntryTable(report.generated || [], report.ig, repository),
      this.convertIssueListToVerificationEntryTable(report.generated || [], report.compositeProfiles, repository),
      this.convertIssueListToVerificationEntryTable(report.generated || [], report.conformanceProfiles, repository),
      this.convertIssueListToVerificationEntryTable(report.generated || [], report.segments, repository),
      this.convertIssueListToVerificationEntryTable(report.generated || [], report.datatypes, repository),
      this.convertIssueListToVerificationEntryTable(report.generated || [], report.valueSets, repository),
      this.convertIssueListToVerificationEntryTable(report.generated || [], report.coConstraintGroups, repository),
    ).pipe(
      map(([ig, compositeProfiles, conformanceProfiles, segments, datatypes, valueSets, coConstraintGroups]) => ({
        ig,
        compositeProfiles,
        conformanceProfiles,
        segments,
        datatypes,
        valueSets,
        coConstraintGroups,
      })));
  }

  convertIssueListToVerificationEntryTable(generated: IDisplayElement[], list: any[], repository: AResourceRepositoryService): Observable<IVerificationEntryTable> {
    return this.getVerificationEntryTable(generated, this.convertErrorsToEntries(list || []), repository);
  }

  createCodeSetEntryTable(list: any[]): IVerificationEntryTable {
    const entries = this.convertErrorsToEntries(list || []);
    const stats = this.getVerificationStats(entries);
    const valid = !(stats.error && stats.error > 0) && !(stats.fatal && stats.fatal > 0);
    const entryList: IVerificationEntryList = {
      target: null,
      stats,
      entries,
    }
    return {
      valid: valid,
      stats,
      resources: [],
      codes: Array.from(new Set(entries.map((entry) => entry.code))),
      severities: Array.from(new Set(entries.map((entry) => entry.severity))),
      entries: [entryList],
    };
  }

  convertErrorsToEntries(errors: any[]): IVerificationEnty[] {
    const ret: IVerificationEnty[] = [];
    errors.forEach((element) => {
      ret.push({
        code: element.code,
        pathId: element.location,
        property: element.locationInfo && element.locationInfo.property ? element.locationInfo.property : null,
        location: element.locationInfo && element.locationInfo.name ? element.locationInfo.name : null,
        targetId: element.target,
        targetType: element.targetType,
        message: element.description,
        severity: element.severity,
        subTarget: element.subTarget,
      });
    });
    return ret;
  }

  convertValueToTocElements(report: IIgVerificationReport): Dictionary<IVerificationEnty[]> {
    return _.groupBy(
      this.convertErrorsToEntries(this.igVerificationReportToIssueList(report)),
      (entry) => entry.targetId,
    );
  }

  igVerificationReportToIssueList(report: IIgVerificationReport): any[] {
    return report ? [
      ...(report.ig || []),
      ...(report.compositeProfiles || []),
      ...(report.conformanceProfiles || []),
      ...(report.segments || []),
      ...(report.datatypes || []),
      ...(report.valueSets || []),
      ...(report.coConstraintGroups || []),
    ] : [];
  }

}
