import { EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';
import { BehaviorSubject, concat, Observable, of } from 'rxjs';
import { flatMap, map, tap } from 'rxjs/operators';
import { Type } from '../../../constants/type.enum';
import { IDocumentRef } from '../../../models/abstract-domain.interface';
import { ChangeType, IChange, IChangeReason, ILocationChangeLog, PropertyType } from '../../../models/save-change';
import { ChangeLogService, IChangeReasonSection } from '../../../services/change-log.service';
import { ChangeReasonDialogComponent, IChangeReasonDialogDisplay } from '../../change-reason-dialog/change-reason-dialog.component';
import { IHL7v2TreeNode } from '../hl7-v2-tree.component';

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
  context: Type;
  @Input()
  node: IHL7v2TreeNode;
  oldValue: T;

  @Input()
  set value(val: T) {
    this.value$.next(val);
    this.oldValue = _.cloneDeep(val);
  }

  @Input()
  set changeLog(log: ILocationChangeLog) {
    this.changeLogService.init(log);
  }

  get changeDisplaySections$() {
    return this.changeLogService ? this.changeLogService.changeDisplaySections$ : null;
  }

  @Output()
  valueChange: EventEmitter<IChange>;
  changeLogService: ChangeLogService;
  value$: BehaviorSubject<T>;

  constructor(
    protected propertyTypes: PropertyType[],
    protected dialog: MatDialog,
  ) {
    this.changeLogService = new ChangeLogService({}, propertyTypes);
    this.valueChange = new EventEmitter<IChange>();
    this.value$ = new BehaviorSubject<T>(undefined);
  }

  onChange<X>(old: X, value: X, propertyType: PropertyType, changeType?: ChangeType, skipReason: boolean = false) {
    this.getChange<X>(old, value, propertyType, changeType, skipReason).pipe(
      tap((change) => {
        this.logChangeInSession(change, propertyType);
        this.valueChange.emit(change);
      }),
    ).subscribe();
  }

  updateReasonForChange(changeReason: IChangeReasonSection) {
    const change = this.createReasonForChange(changeReason);
    this.logChangeInSession(change, changeReason.property);
    this.valueChange.emit(change);
  }

  createReasonForChange(changeReason: IChangeReasonSection): IChange {
    const value: IChangeReason = changeReason && changeReason.reason && changeReason.reason !== '' ? {
      reason: changeReason.reason,
      date: changeReason.date,
    } : undefined;
    return {
      location: this.location + '>' + changeReason.property,
      propertyType: PropertyType.CHANGEREASON,
      propertyValue: value,
      oldPropertyValue: this.changeLogService.getInit(changeReason.property, { resource: this.context }),
      position: this.position,
      changeType: ChangeType.UPDATE,
    };
  }

  getChangeReasonForPropertyChange(change: IChange, skipReason: boolean = false): Observable<IChange> {
    if (this.enforceChangeReason && !skipReason && this.isActualChange(change)) {
      return (this.getDisplayTemplateForProperty(change) || of(undefined)).pipe(
        flatMap((display) => {
          return this.dialog.open(ChangeReasonDialogComponent, {
            data: {
              previous: change.oldPropertyValue,
              current: change.propertyValue,
              caption: change.propertyType,
              display,
              changeReason: this.changeLogService.get(change.propertyType, { resource: this.context }),
            },
          }).afterClosed().pipe(
            map((changeReason) => {
              return this.createReasonForChange({
                ...changeReason,
                property: change.propertyType,
              });
            }));
        }),
      );
    } else {
      return of();
    }
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

    const reasonForChange = this.getChangeReasonForPropertyChange(change, skipReason);

    return concat(of(change), reasonForChange);
  }

  logChangeInSession(change: IChange<IChangeReason>, property: PropertyType) {
    if (change.propertyType === PropertyType.CHANGEREASON) {
      this.changeLogService.put({ property, context: { resource: this.context }, ...change.propertyValue });
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
