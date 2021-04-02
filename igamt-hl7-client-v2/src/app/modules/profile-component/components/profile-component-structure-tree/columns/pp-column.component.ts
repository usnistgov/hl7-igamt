import { Input, Output, EventEmitter } from "@angular/core";
import { Type } from "src/app/modules/shared/constants/type.enum";
import { IDocumentRef } from "src/app/modules/shared/models/abstract-domain.interface";
import { Observable, BehaviorSubject, combineLatest } from "rxjs";
import { PropertyType } from "src/app/modules/shared/models/save-change";
import { MatDialog } from "@angular/material";
import { IItemProperty } from "src/app/modules/shared/models/profile.component";
import { map } from "rxjs/operators";
import { IProfileComponentChange } from "../profile-component-structure-tree.component";

export abstract class PPColumn<T> {
  @Input()
  type: Type;
  @Input()
  documentType: Type;
  @Input()
  documentRef: IDocumentRef;
  @Input()
  changeEvent: Observable<IProfileComponentChange>;
  @Input()
  location: string;
  @Input()
  elementId: string;
  @Input()
  anchor;
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
  set value(val: T) {
    this.value$.next(val);
  }
  @Input()
  set items(items: Record<PropertyType, IItemProperty>) {
    if (items) {
      this.apply(items);
      this._items = items;
      this.active = this.propertyTypes.map((p) => !!items[p]).includes(true);

      if (!this.active) {
        this.applied$.next(undefined);
      }
    } else {
      this.applied$.next(undefined);
    }
  }

  active: boolean;

  get items() {
    return this._items;
  }

  @Output()
  valueChange: EventEmitter<IProfileComponentChange>;
  value$: BehaviorSubject<T>;
  applied$: BehaviorSubject<T>;

  _items: Record<PropertyType, IItemProperty>;

  constructor(
    protected propertyTypes: PropertyType[],
    protected dialog: MatDialog,
  ) {
    this.valueChange = new EventEmitter<IProfileComponentChange>();
    this.value$ = new BehaviorSubject<T>(undefined);
    this.applied$ = new BehaviorSubject<T>(undefined);
  }

  onChange<X extends IItemProperty>(item: X, propertyType: PropertyType) {
    this.valueChange.emit({
      property: item,
      unset: !item,
      path: this.location,
      type: propertyType,
    });
  }

  onChangeForBinding<X extends IItemProperty>(location: string, target: string, item: X, propertyType: PropertyType) {
    this.valueChange.emit({
      property: item,
      unset: !item,
      path: location,
      root: !location,
      target: target,
      binding: true,
      type: propertyType,
    });
  }

  get effectiveValue$(): Observable<T> {
    return combineLatest(
      this.value$,
      this.applied$,
    ).pipe(
      map(([dynamic, applied]) => {
        return applied || dynamic;
      })
    )
  }

  abstract apply(values: Record<PropertyType, IItemProperty>);

  getParentLocation() {
    return this.location.includes('-') ? this.location.substring(0, this.location.lastIndexOf('-')) : '';
  }

}
