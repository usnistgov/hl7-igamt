import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ICardinalityRange } from 'src/app/modules/shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { IItemProperty, IPropertyCardinalityMax, IPropertyCardinalityMin } from 'src/app/modules/shared/models/profile.component';
import { PropertyType } from 'src/app/modules/shared/models/save-change';
import { PPColumn } from '../pp-column.component';

@Component({
  selector: 'app-pp-cardinality',
  templateUrl: './pp-cardinality.component.html',
  styleUrls: ['./pp-cardinality.component.scss'],
})
export class PpCardinalityComponent extends PPColumn<ICardinalityRange> implements OnInit {

  range: ICardinalityRange;

  constructor(dialog: MatDialog) {
    super(
      [PropertyType.CARDINALITYMIN, PropertyType.CARDINALITYMAX],
      dialog,
    );
    this.effectiveValue$.subscribe(
      (value) => {
        if (value) {
          this.range = { ...value };
        }
      },
    );
  }

  apply(values: Record<PropertyType, IItemProperty>) {
    if (values[PropertyType.CARDINALITYMIN] && values[PropertyType.CARDINALITYMAX]) {
      this.applied$.next({
        min: (values[PropertyType.CARDINALITYMIN] as IPropertyCardinalityMin).min,
        max: (values[PropertyType.CARDINALITYMAX] as IPropertyCardinalityMax).max,
      });
    }
  }

  activate() {
    this.onChange<IPropertyCardinalityMax>({
      max: this.range.max,
      propertyKey: PropertyType.CARDINALITYMAX,
    },
      PropertyType.CARDINALITYMAX,
    );

    this.onChange<IPropertyCardinalityMin>({
      min: this.range.min,
      propertyKey: PropertyType.CARDINALITYMIN,
    },
      PropertyType.CARDINALITYMIN,
    );
  }

  clear() {
    this.onChange<IPropertyCardinalityMax>(undefined, PropertyType.CARDINALITYMAX);
    this.onChange<IPropertyCardinalityMin>(undefined, PropertyType.CARDINALITYMIN);
    this.applied$.next(undefined);
  }

  hasValue(range) {
    return range && range.min !== undefined && range.max !== undefined;
  }

  minChange(value: number) {
    this.onChange<IPropertyCardinalityMin>({
      min: value,
      propertyKey: PropertyType.CARDINALITYMIN,
    },
      PropertyType.CARDINALITYMIN,
    );
  }

  maxChange(value: string) {
    this.onChange<IPropertyCardinalityMax>({
      max: value,
      propertyKey: PropertyType.CARDINALITYMAX,
    },
      PropertyType.CARDINALITYMAX,
    );
  }

  ngOnInit() {
  }

}
