import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PPColumn } from '../pp-column.component';
import { PropertyType } from 'src/app/modules/shared/models/save-change';
import { IItemProperty, IPropertyLengthType, IPropertyConfLength } from 'src/app/modules/shared/models/profile.component';
import { MatDialog } from '@angular/material';
import { LengthType } from 'src/app/modules/shared/constants/length-type.enum';

export interface IConfLength {
  confLength: string;
  lengthType: LengthType;
}

@Component({
  selector: 'app-pp-conf-length',
  templateUrl: './pp-conf-length.component.html',
  styleUrls: ['./pp-conf-length.component.scss'],
})
export class PpConfLengthComponent extends PPColumn<IConfLength> implements OnInit {

  val: IConfLength;
  @Output()
  updateLengthType: EventEmitter<LengthType>;

  constructor(dialog: MatDialog) {
    super(
      [PropertyType.CONFLENGTH],
      dialog,
    );
    this.updateLengthType = new EventEmitter();
    this.effectiveValue$.subscribe(
      (value) => {
        this.onInitValue(value);
      },
    );
  }

  onInitValue(value: IConfLength): void {
    this.val = {
      ...value,
    };
  }

  confLengthChange(value: string) {
    this.onChange<IPropertyConfLength>({
      confLength: value,
      propertyKey: PropertyType.CONFLENGTH,
    }, PropertyType.CONFLENGTH);
  }

  activeLength() {
    return this.val.lengthType === LengthType.ConfLength;
  }

  lenghtIsActive() {
    return this.items && this.items[PropertyType.LENGTHMIN] && this.items[PropertyType.LENGTHMAX];
  }

  clear() {
    this.onChange<IPropertyConfLength>(undefined, PropertyType.CONFLENGTH);

    if (!this.lenghtIsActive()) {
      this.onChange<IPropertyLengthType>(undefined, PropertyType.LENGTHTYPE);
    } else {
      this.onChange<IPropertyLengthType>({
        type: LengthType.Length,
        propertyKey: PropertyType.LENGTHTYPE,
      }, PropertyType.LENGTHTYPE);
      this.updateLengthType.emit(LengthType.Length);
    }

    this.applied$.next(undefined);
  }

  clearType() {
    this.onChange<IPropertyLengthType>({
      type: LengthType.Length,
      propertyKey: PropertyType.LENGTHTYPE,
    }, PropertyType.LENGTHTYPE);
    this.updateLengthType.emit(LengthType.Length);
  }

  apply(values: Record<PropertyType, IItemProperty>) {
    if (values[PropertyType.CONFLENGTH] && values[PropertyType.LENGTHTYPE]) {
      const confLength: string = (values[PropertyType.CONFLENGTH] as IPropertyConfLength).confLength;
      const lengthType: LengthType = (values[PropertyType.LENGTHTYPE] as IPropertyLengthType).type;
      this.applied$.next({
        confLength,
        lengthType
      });
    }
  }

  activate() {
    this.onChange<IPropertyConfLength>({
      confLength: this.val.confLength,
      propertyKey: PropertyType.CONFLENGTH,
    },
      PropertyType.CONFLENGTH
    );

    if (!this.lenghtIsActive()) {
      this.onChange<IPropertyLengthType>({
        type: LengthType.ConfLength,
        propertyKey: PropertyType.LENGTHTYPE,
      },
        PropertyType.LENGTHTYPE
      );

      this.applied$.next({
        ...this.applied$.getValue(),
        lengthType: LengthType.ConfLength,
      });
    }
  }

  ngOnInit() {
  }

}
