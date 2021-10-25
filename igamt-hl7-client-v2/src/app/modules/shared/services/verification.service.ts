import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { combineLatest, concat, EMPTY, interval, Observable, of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { IVerificationEnty } from '../../dam-framework';
import { selectWorkspaceActive, selectWorkspaceVerification } from '../../dam-framework/store';
import { IResourceKey } from '../components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../constants/type.enum';
import { IDisplayElement } from '../models/display-element.interface';
import { Severity } from '../models/verification.interface';
import { AResourceRepositoryService } from './resource-repository.service';

export interface IVerificationStats {
  informational?: number;
  error?: number;
  fatal?: number;
  warning?: number;
}

export interface IStatusBarInfo {
  supported: boolean;
  checked: boolean;
  loading: boolean;
  lastUpdate$?: Observable<string>;
  title: string;
  stats?: IVerificationStats;
}

export interface IVerificationEntryTable {
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

@Injectable({
  providedIn: 'root',
})
export class VerificationService {

  constructor(private http: HttpClient, private store: Store<any>) { }

  getEditorStatusBarInfo(): Observable<IStatusBarInfo> {
    return combineLatest(
      this.store.select(selectWorkspaceActive),
      this.store.select(selectWorkspaceVerification),
    ).pipe(
      map(([active, verification]) => {
        const supported = verification.supported;
        const checked = !!verification.verificationTime;
        return {
          supported,
          checked,
          loading: verification.loading,
          stats: this.getVerificationStats(verification.entries || []),
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

  getVerificationStats(entry: IVerificationEnty[]): IVerificationStats {
    return {
      error: entry.filter((e) => e.severity === Severity.ERROR).length,
      informational: entry.filter((e) => e.severity === Severity.INFORMATIONAL).length,
      fatal: entry.filter((e) => e.severity === Severity.FATAL).length,
      warning: entry.filter((e) => e.severity === Severity.WARNING).length,
    };
  }

  getEditorVerificationEntryTable(repository: AResourceRepositoryService): Observable<IVerificationEntryTable> {
    return this.store.select(selectWorkspaceVerification).pipe(
      flatMap((verification) => {
        return verification.supported ? this.getVerificationEntryTable(verification.entries || [], repository) : of();
      }),
    );
  }

  getVerificationEntryTable(entries: IVerificationEnty[], repository: AResourceRepositoryService): Observable<IVerificationEntryTable> {
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
      resourceKeys.map((key) => repository.getResourceDisplay(key.type, key.id)),
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
          stats,
          resources,
          codes,
          severities,
          entries: resourceLists,
        };
      }),
    );
  }
}
