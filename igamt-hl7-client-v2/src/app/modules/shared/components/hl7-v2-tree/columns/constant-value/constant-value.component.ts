import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { IChange } from 'src/app/modules/shared/models/save-change';
import { ChangeType, PropertyType } from '../../../../models/save-change';
import { IStringValue } from '../../hl7-v2-tree.component';
import { HL7v2TreeColumnComponent } from '../hl7-v2-tree-column.component';

@Component({
  selector: 'app-constant-value',
  templateUrl: './constant-value.component.html',
  styleUrls: ['./constant-value.component.scss'],
})
export class ConstantValueComponent extends HL7v2TreeColumnComponent<IStringValue> implements OnInit {

  constant: IStringValue;
  edit: boolean;
  tmp: string;
  @Input()
  leaf: boolean;

  constructor(protected dialog: MatDialog) {
    super([PropertyType.CONSTANTVALUE], dialog);
    this.value$.subscribe(
      (value) => {
        this.constant = value;
      },
    );
  }

  isActualChange<X>(change: IChange<X>): boolean {
    return change.propertyValue !== change.oldPropertyValue;
  }

  toggleEdit() {
    if (this.edit) {
      this.constant.value = this.tmp;
      this.onChange(this.oldValue ? this.oldValue.value : '', this.constant.value, PropertyType.CONSTANTVALUE, ChangeType.UPDATE);
    } else {
      this.tmp = this.constant.value;
    }
    this.edit = !this.edit;
  }

  clear() {
    this.constant.value = '';
    this.onChange(this.oldValue ? this.oldValue.value : '', this.constant.value, PropertyType.CONSTANTVALUE, ChangeType.UPDATE);
  }

  ngOnInit() {
  }

}
