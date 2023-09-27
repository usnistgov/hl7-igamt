import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import * as moment from 'moment';
import { combineLatest, concat, EMPTY, interval, Observable, of } from 'rxjs';
import { flatMap, map, tap } from 'rxjs/operators';
import { IVerificationEnty } from '../../dam-framework';
import { selectWorkspaceActive, selectWorkspaceVerification } from '../../dam-framework/store';
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
        return verification.supported ? this.getVerificationEntryTable(verification.entries || [], repository) : of(undefined);
      }),
    );
  }

  getVerificationEntryTable(entries: IVerificationEnty[], repository: AResourceRepositoryService): Observable<IVerificationEntryTable> {
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

    const keyToStr = (id: string, type: string): string => {
      return `${id}@${type}`;
    };

    const stats = this.getVerificationStats(entries);
    const codes = Array.from(new Set(entries.map((entry) => entry.code)));
    const severities = Array.from(new Set(entries.map((entry) => entry.severity)));
    const resourceKeys = Object.values(entries.reduce((acc, entry) => {
      const key: IResourceKey = {
        id: entry.targetId,
        type: entry.targetType as Type,
      };
      return {
        ...acc,
        [keyToStr(key.id, key.type)]: key,
      };
    }, {} as Record<string, IResourceKey>));

    return combineLatest(
      resourceKeys.map(
        (key) => repository.getResourceDisplay(key.type, key.id).pipe(tap((x) => {
          if (!x) {
            console.log(key.type, key.id);
          }
        })),
      ),

    ).pipe(
      map((resources) => {
        const grouped = entries.reduce((acc, entry) => {
          const key: IResourceKey = {
            id: entry.targetId,
            type: entry.targetType as Type,
          };
          const keyStr = keyToStr(key.id, key.type);
          return {
            ...acc,
            [keyStr]: [
              ...(acc[keyStr] ? acc[keyStr] : []),
              entry,
            ],
          };
        }, {} as Record<string, IVerificationEnty[]>);
        const resourceLists = Object.keys(grouped).map((key) => {
          return {
            target: resources.find((resource) => keyToStr(resource.id, resource.type) === key),
            stats: this.getVerificationStats(grouped[key]),
            entries: grouped[key],
          };
        });

        return {
          valid: false,
          stats,
          resources,
          codes,
          severities,
          entries: resourceLists,
        };
      }),
    );
  }

  convertValue(report: any, repository: AResourceRepositoryService): Observable<IVerificationEntryTable> {
    let errors = [];
    for (const property in report) {
      if (report[property].length) {
        report[property].forEach((element) => {
          errors = _.union(errors, element.errors);
        });
      }
    }
    return this.getVerificationEntryTable(this.convertErrorsToEntries(errors), repository);

  }

  verificationReportToDisplay(report: any, repository: AResourceRepositoryService): Observable<IVerificationResultDisplay> {
    return combineLatest(
      this.convertValueByType(report, Type.IGDOCUMENT, repository),
      this.convertValueByType(report, Type.CONFORMANCEPROFILE, repository),
      this.convertValueByType(report, Type.SEGMENT, repository),
      this.convertValueByType(report, Type.DATATYPE, repository),
      this.convertValueByType(report, Type.SEGMENT, repository),
    ).pipe(
      map(([ig, conformanceProfiles, segments, datatypes, valueSets]) => ({
        ig,
        conformanceProfiles,
        segments,
        datatypes,
        valueSets,
      })));
  }

  convertValueByType(report: any, type: Type, repository: AResourceRepositoryService): Observable<IVerificationEntryTable> {
    let errors = [];
    let prop: string;
    if (type === Type.IGDOCUMENT) {

      prop = 'igVerificationResult';
    } else if (type === Type.SEGMENT) {
      prop = 'segmentVerificationResults';

    } else if (type === Type.CONFORMANCEPROFILE) {
      prop = 'conformanceProfileVerificationResults';
    } else if (type === Type.DATATYPE) {
      prop = 'datatypeVerificationResults';
    } else if (type === Type.VALUESET) {
      prop = 'valuesetVerificationResults';
    }
    if (report && report[prop] && report[prop].length) {
      report[prop].forEach((element) => {
        const elementErrors = element.errors.map((error) => {
          return { ...error, target: element.resourceId, targetType: element.resourceType };
        });
        errors = _.union(errors, elementErrors);
      });
    }
    return this.getVerificationEntryTable(this.convertErrorsToEntries(errors), repository);
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
      });
    });
    return ret;
  }

  convertValueToTocElements(report: any): Dictionary<IVerificationEnty[]> {
    let temp: Dictionary<IVerificationEnty[]> = {};
    let errors = [];
    for (const property in report) {
      if (report && report[property] && report[property].length) {
        report[property].forEach((element) => {

          const elementErrors = element.errors.map((error) => {
            return { ...error, targetType: element.resourceType, target: element.resourceId };
          });
          errors = _.union(errors, elementErrors);
        });
      }
    }
    temp = _.groupBy(errors, (x) => x.target);
    return temp;
  }

}
