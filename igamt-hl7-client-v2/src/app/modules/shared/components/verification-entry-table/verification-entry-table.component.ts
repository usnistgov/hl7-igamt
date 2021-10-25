import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Severity } from '../../models/verification.interface';
import { IVerificationEntryList, IVerificationEntryTable } from '../../services/verification.service';

export interface IEntryFilter {
  severity: {
    fatal: boolean;
    error: boolean;
    warning: boolean;
    informational: boolean;
  };
  codes: string[];
  properties: string[];
}

@Component({
  selector: 'app-verification-entry-table',
  templateUrl: './verification-entry-table.component.html',
  styleUrls: ['./verification-entry-table.component.scss'],
})
export class VerificationEntryTableComponent implements OnInit {
  filter: BehaviorSubject<IEntryFilter>;
  table: BehaviorSubject<IVerificationEntryTable>;

  severity = [
    { key: 'fatal', type: Severity.FATAL },
    { key: 'error', type: Severity.ERROR },
    { key: 'warning', type: Severity.WARNING },
    { key: 'informational', type: Severity.INFORMATIONAL },
  ];

  @Input()
  set value(table: IVerificationEntryTable) {
    this.table.next(table);
  }

  verification$: Observable<IVerificationEntryTable>;

  constructor() {
    this.filter = new BehaviorSubject<IEntryFilter>({
      severity: {
        fatal: true,
        error: true,
        warning: true,
        informational: true,
      },
      codes: [],
      properties: [],
    });
    this.table = new BehaviorSubject(undefined);
    this.verification$ = combineLatest(
      this.filter.asObservable(),
      this.table,
    ).pipe(
      tap((a) => console.log(a)),
      map(([filterValue, table]) => {
        return table ? {
          ...table,
          entries: table.entries.map((te) => ({
            ...this.applyFilter(filterValue, te),
          })),
        } : undefined;
      }),
    );
  }

  updateFilter() {
    this.filter.next(this.filter.getValue());
  }

  applyFilter(filter: IEntryFilter, verification: IVerificationEntryList): IVerificationEntryList {
    const entries = verification.entries.filter((entry) => {
      const keepSeverity: boolean =
        entry.severity === Severity.ERROR && filter.severity.error ||
        entry.severity === Severity.FATAL && filter.severity.fatal ||
        entry.severity === Severity.WARNING && filter.severity.warning ||
        entry.severity === Severity.INFORMATIONAL && filter.severity.informational;
      const keepCode = filter.codes.length === 0 || filter.codes.includes(entry.code);
      return keepSeverity && keepCode;
    });
    return {
      ...verification,
      entries,
    };
  }

  ngOnInit() {
  }

}
