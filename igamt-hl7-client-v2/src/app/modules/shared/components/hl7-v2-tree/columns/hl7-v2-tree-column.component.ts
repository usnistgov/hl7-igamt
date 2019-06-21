import { EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChangeType, IChange, PropertyType } from '../../../models/save-change';

export abstract class HL7v2TreeColumnComponent<T> {

  @Input()
  location: string;
  @Input()
  public viewOnly: string;
  @Input()
  position: number;
  @Input()
  set value(val: T) {
    this.value$.next(val);
  }
  @Output()
  valueChange: EventEmitter<IChange>;
  value$: BehaviorSubject<T>;

  constructor(protected propertyTypes: PropertyType[]) {
    this.valueChange = new EventEmitter<IChange>();
    this.value$ = new BehaviorSubject<T>(undefined);
  }

  onChange<X>(old: X, value: X, propertyType: PropertyType, changeType?: ChangeType) {
    if (this.propertyTypes.indexOf(propertyType) === -1) {
      throw new Error('Column does not support property : ' + propertyType);
    }
    this.valueChange.emit({
      location: this.location,
      propertyType,
      propertyValue: value,
      oldPropertyValue: old,
      position: this.position,
      changeType,
    });
  }

  getInputValue(): T {
    return this.value$.getValue();
  }
}