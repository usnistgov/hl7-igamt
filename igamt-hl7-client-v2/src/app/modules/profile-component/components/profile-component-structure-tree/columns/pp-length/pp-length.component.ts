import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LengthType } from 'src/app/modules/shared/constants/length-type.enum';
import { ILengthRange } from 'src/app/modules/shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { PPColumn } from '../pp-column.component';
import { MatDialog } from '@angular/material';
import { PropertyType } from 'src/app/modules/shared/models/save-change';
import { IPropertyLengthMin, IPropertyLengthMax, IPropertyLengthType, IItemProperty } from 'src/app/modules/shared/models/profile.component';

export interface ILength {
  length: ILengthRange;
  lengthType: LengthType;
}


@Component({
  selector: 'app-pp-length',
  templateUrl: './pp-length.component.html',
  styleUrls: ['./pp-length.component.scss'],
})
export class PpLengthComponent extends PPColumn<ILength> implements OnInit {

  val: ILength;
  @Output()
  updateLengthType: EventEmitter<LengthType>;

  onInitValue(value: ILength): void {
    this.val = {
      ...value,
    };
  }


  constructor(dialog: MatDialog) {
    super(
      [PropertyType.LENGTHMIN, PropertyType.LENGTHMAX],
      dialog,
    );
    this.updateLengthType = new EventEmitter();
    this.effectiveValue$.subscribe(
      (value) => {
        this.onInitValue(value);
      },
    );
  }

  confLenghtIsActive() {
    return this.items && this.items[PropertyType.CONFLENGTH];
  }

  minChange(value: string) {
    this.onChange<IPropertyLengthMin>({
      min: value,
      propertyKey: PropertyType.LENGTHMIN,
    }, PropertyType.LENGTHMIN);
  }

  maxChange(value: string) {
    this.onChange<IPropertyLengthMax>({
      max: value,
      propertyKey: PropertyType.LENGTHMAX,
    }, PropertyType.LENGTHMAX);
  }

  activeLength() {
    return this.val.lengthType === LengthType.Length;
  }

  clear() {
    this.onChange<IPropertyLengthMin>(undefined, PropertyType.LENGTHMIN);
    this.onChange<IPropertyLengthMax>(undefined, PropertyType.LENGTHMAX);

    if (!this.confLenghtIsActive()) {
      this.onChange<IPropertyLengthType>(undefined, PropertyType.LENGTHTYPE);
    } else {
      this.onChange<IPropertyLengthType>({
        type: LengthType.ConfLength,
        propertyKey: PropertyType.LENGTHTYPE,
      }, PropertyType.LENGTHTYPE);
      this.updateLengthType.emit(LengthType.ConfLength);
    }

    this.applied$.next(undefined);
  }

  clearType() {
    this.onChange<IPropertyLengthType>({
      type: LengthType.ConfLength,
      propertyKey: PropertyType.LENGTHTYPE,
    }, PropertyType.LENGTHTYPE);
    this.updateLengthType.emit(LengthType.ConfLength);
  }

  apply(values: Record<PropertyType, IItemProperty>) {
    if (values[PropertyType.LENGTHMIN] && values[PropertyType.LENGTHMAX] && values[PropertyType.LENGTHTYPE]) {
      const min = (values[PropertyType.LENGTHMIN] as IPropertyLengthMin).min;
      const max = (values[PropertyType.LENGTHMAX] as IPropertyLengthMax).max;
      const lengthType: LengthType = (values[PropertyType.LENGTHTYPE] as IPropertyLengthType).type;
      this.applied$.next({
        length: {
          min, max
        },
        lengthType
      });
    }
  }

  activate() {
    this.onChange<IPropertyLengthMin>({
      min: this.val.length.min,
      propertyKey: PropertyType.LENGTHMIN,
    },
      PropertyType.LENGTHMIN
    );
    this.onChange<IPropertyLengthMax>({
      max: this.val.length.max,
      propertyKey: PropertyType.LENGTHMAX,
    },
      PropertyType.LENGTHMAX
    );

    if (!this.confLenghtIsActive()) {
      this.onChange<IPropertyLengthType>({
        type: LengthType.Length,
        propertyKey: PropertyType.LENGTHTYPE,
      },
        PropertyType.LENGTHTYPE
      );

      this.applied$.next({
        ...this.applied$.getValue(),
        lengthType: LengthType.Length,
      });
    }
  }

  ngOnInit() {
  }

}
