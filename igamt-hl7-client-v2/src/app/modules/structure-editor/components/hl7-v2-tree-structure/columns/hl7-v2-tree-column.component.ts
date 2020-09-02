import { EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Type } from '../../../../shared/constants/type.enum';
import { IGroup } from '../../../../shared/models/conformance-profile.interface';
import { ChangeType, IChange, PropertyType } from '../../../../shared/models/save-change';
import { IStructureElement } from '../../../../shared/models/structure-element.interface';

export interface IStructureContainer {
  [k: string]: any;
  childen: IStructureElement[];
}

export abstract class HL7v2TreeColumnComponent<T> {

  @Input()
  structure: IStructureContainer;
  @Input()
  type: Type;
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

  @Output()
  valueChange: EventEmitter<IChange>;

  value$: BehaviorSubject<T>;

  constructor(
    protected propertyTypes: PropertyType[],
    protected dialog: MatDialog,
  ) {
    this.valueChange = new EventEmitter<IChange>();
    this.value$ = new BehaviorSubject<T>(undefined);
  }

  onChange<X>(old: X, value: X, propertyType: PropertyType, changeType?: ChangeType) {
    this.getChange<X>(old, value, propertyType).pipe(
      tap((change) => {
        this.valueChange.emit(change);
      }),
    ).subscribe();
  }

  getTargetLocation<E extends IStructureElement>(): E {
    const loop = (path: string[], elm: IStructureElement): IStructureElement => {
      if (!path || path.length === 0) {
        return elm;
      } else {
        if (elm && elm.type === Type.GROUP) {
          const [head, ...tail] = path;
          const step = (elm as IGroup).children.find((e) => e.id === head);
          return loop(tail, step);
        } else {
          throw new Error('Invalid Location');
        }
      }
    };

    const parts = this.location !== '' ? this.location.split('-') : [];
    const [first, ...rest] = parts;

    if (first) {
      const start = this.structure.children.find((e) => e.id === first);
      if (start) {
        return loop(rest, start) as E;
      } else {
        throw new Error('Invalid Location');
      }
    } else {
      return undefined;
    }
  }

  applyToTarget<E extends IStructureElement>(fn: (target: E) => any) {
    const target = this.getTargetLocation<E>();
    fn(target);
  }

  getChange<X>(old: X, value: X, propertyType: PropertyType, changeType?: ChangeType): Observable<IChange> {
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

    return of(change);
  }

  getInputValue(): T {
    return this.value$.getValue();
  }
}
