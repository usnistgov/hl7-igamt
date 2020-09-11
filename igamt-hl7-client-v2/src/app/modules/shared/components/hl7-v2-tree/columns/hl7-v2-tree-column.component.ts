import { EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { flatMap, map, tap } from 'rxjs/operators';
import { Type } from '../../../constants/type.enum';
import { IDocumentRef } from '../../../models/abstract-domain.interface';
import { ChangeType, IChange, IChangeLog, PropertyType } from '../../../models/save-change';
import { IChangeReasonSection } from '../../change-log-info/change-log-info.component';
import { ChangeReasonDialogComponent, IChangeReasonDialogDisplay } from '../../change-reason-dialog/change-reason-dialog.component';

export abstract class HL7v2TreeColumnComponent<T> {

  @Input()
  enforceChangeReason: boolean;
  @Input()
  type: Type;
  @Input()
  documentType: Type;
  @Input()
  documentRef: IDocumentRef;
  @Input()
  changeEvent: Observable<IChange>;
  @Input()
  location: string;
  @Input()
  name: string;
  @Input()
  level: number;
  @Input()
  public viewOnly: boolean;
  @Input()
  public globalViewOnly: boolean;
  @Input()
  position: number;
  @Input()
  set value(val: T) {
    this.value$.next(val);
  }
  @Input()
  set changeLog(log: IChangeLog) {
    this._changeLog = log;
    this.sessionLog = {
      ...log,
    };
    this.updateLogDisplay();
  }

  get changeLog() {
    return this._changeLog;
  }

  @Output()
  valueChange: EventEmitter<IChange>;
  sessionLog: IChangeLog;
  _changeLog: IChangeLog;
  value$: BehaviorSubject<T>;
  public changeDisplaySections: IChangeReasonSection[];

  constructor(
    protected propertyTypes: PropertyType[],
    protected dialog: MatDialog,
  ) {
    this.sessionLog = {};
    this.changeDisplaySections = [];
    this.valueChange = new EventEmitter<IChange>();
    this.value$ = new BehaviorSubject<T>(undefined);
  }

  onChange<X>(old: X, value: X, propertyType: PropertyType, changeType?: ChangeType, skipReason: boolean = false) {
    this.getChange<X>(old, value, propertyType, changeType, skipReason).pipe(
      tap((change) => {
        this.logChangeInSession(change);
        this.valueChange.emit(change);
      }),
    ).subscribe();
  }

  getChange<X>(old: X, value: X, propertyType: PropertyType, changeType?: ChangeType, skipReason: boolean = false): Observable<IChange> {
    if (this.propertyTypes.indexOf(propertyType) === -1) {
      throw new Error('Column does not support property : ' + propertyType);
    }

    const change: IChange = {
      location: this.location,
      propertyType,
      propertyValue: value,
      oldPropertyValue: old,
      position: this.position,
      changeType,
    };

    if (this.enforceChangeReason && !skipReason) {
      if (this.isActualChange(change)) {

        return (this.getDisplayTemplateForProperty(change) || of(undefined)).pipe(
          flatMap((display) => {
            return this.dialog.open(ChangeReasonDialogComponent, {
              data: {
                previous: old,
                current: value,
                caption: propertyType,
                display,
                changeReason: this.sessionLog[propertyType],
              },
            }).afterClosed().pipe(
              map((changeReason) => {
                if (changeReason && changeReason.reason && changeReason.reason !== '') {
                  change.changeReason = changeReason;
                }
                return change;
              }));
          }),
        );

      } else {
        change.changeReason = this.changeLog[propertyType];
      }
    }

    return of(change);
  }

  logChangeInSession(change: IChange) {
    if (change.changeReason) {
      this.sessionLog[change.propertyType] = change.changeReason;
    } else {
      delete this.sessionLog[change.propertyType];
    }
    this.updateLogDisplay();
  }

  updateLogDisplay() {
    this.changeDisplaySections = [];

    for (const prop of this.propertyTypes) {
      if (this.sessionLog[prop]) {
        this.changeDisplaySections.push({
          ...this.sessionLog[prop],
          property: prop,
        });
      }
    }
  }

  abstract isActualChange<X>(change: IChange<X>): boolean;

  // Override This
  getDisplayTemplateForProperty(change: IChange): Observable<IChangeReasonDialogDisplay> {
    return null;
  }

  getInputValue(): T {
    return this.value$.getValue();
  }
}
