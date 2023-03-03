import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { Severity } from '../../models/verification.interface';
import { IVerificationEntryList, IVerificationEntryTable } from '../../services/verification.service';
import { Type } from './../../constants/type.enum';

export interface IEntryFilter {
  severity: {
    fatal: boolean;
    error: boolean;
    warning: boolean;
    informational: boolean;
  };
  codes: string[];
  properties: string[];
  type?: Type;
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
  @Input()
  documentId: string;

  @Input()
  set filterType(type: Type) {
    this.filter.next({ ...this.filter.getValue(), type });
  }
  verification$: Observable<IVerificationEntryTable>;

  constructor() {
    this.filter = new BehaviorSubject<IEntryFilter>({
      severity: {
        fatal: true,
        error: true,
        warning: false,
        informational: false,
      },
      codes: [],
      properties: [],
      type: undefined,
    });
    this.table = new BehaviorSubject(undefined);
    this.verification$ = combineLatest(
      this.filter.asObservable(),
      this.table,
    ).pipe(
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

  applyFilter(filterValue: IEntryFilter, verification: IVerificationEntryList): IVerificationEntryList {
    const entries = verification.entries.filter((entry) => {
      const keepSeverity: boolean =
        entry.severity === Severity.ERROR && filterValue.severity.error ||
        entry.severity === Severity.FATAL && filterValue.severity.fatal ||
        entry.severity === Severity.WARNING && filterValue.severity.warning ||
        entry.severity === Severity.INFORMATIONAL && filterValue.severity.informational;
      const keepCode = filterValue.codes.length === 0 || filterValue.codes.includes(entry.code);
      const keepType = !filterValue.type || entry.targetType === filterValue.type;

      return keepSeverity && keepCode && keepType;
    });
    return {
      ...verification,
      entries,
    };
  }

  ngOnInit() {
  }

}
