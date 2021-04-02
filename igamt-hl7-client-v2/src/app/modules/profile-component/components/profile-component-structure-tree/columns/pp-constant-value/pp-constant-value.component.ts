import { Component, OnInit } from '@angular/core';
import { PPColumn } from '../pp-column.component';
import { IStringValue } from 'src/app/modules/shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { PropertyType } from 'src/app/modules/shared/models/save-change';
import { IItemProperty, IPropertyConstantValue } from 'src/app/modules/shared/models/profile.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-pp-constant-value',
  templateUrl: './pp-constant-value.component.html',
  styleUrls: ['./pp-constant-value.component.scss']
})
export class PpConstantValueComponent extends PPColumn<IStringValue> implements OnInit {

  constant: IStringValue;
  edit: boolean;
  tmp: string;

  constructor(dialog: MatDialog) {
    super(
      [PropertyType.CONSTANTVALUE],
      dialog,
    );
    this.effectiveValue$.subscribe(
      (value) => {
        this.constant = {
          ...value,
        };
      },
    );
  }

  change(event) {
    this.constant.value = event;
    this.onChange<IPropertyConstantValue>({
      constantValue: this.constant.value,
      propertyKey: PropertyType.CONSTANTVALUE,
    },
      PropertyType.CONSTANTVALUE
    )
  }

  apply(values: Record<PropertyType, IItemProperty>) {
    if (values[PropertyType.CONSTANTVALUE]) {
      this.applied$.next({
        value: (values[PropertyType.CONSTANTVALUE] as IPropertyConstantValue).constantValue
      });
    }
  }

  activate() {
    this.onChange<IPropertyConstantValue>({
      constantValue: this.constant.value,
      propertyKey: PropertyType.CONSTANTVALUE,
    },
      PropertyType.CONSTANTVALUE
    )
  }

  clear() {
    this.onChange<IPropertyConstantValue>(undefined, PropertyType.CONSTANTVALUE);
    this.applied$.next(undefined);
  }

  ngOnInit() {
  }

}
