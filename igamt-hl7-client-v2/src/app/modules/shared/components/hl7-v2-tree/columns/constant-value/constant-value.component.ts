import { Component, OnInit } from '@angular/core';
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

  constructor() {
    super([PropertyType.CONSTANTVALUE]);
    this.value$.subscribe(
      (value) => {
        this.constant = {
          ...value,
        };
      },
    );
  }

  toggleEdit() {
    if (this.edit) {
      this.constant.value = this.tmp;
      this.onChange(this.getInputValue().value, this.constant.value, PropertyType.CONSTANTVALUE, ChangeType.UPDATE);
    } else {
      this.tmp = this.constant.value;
    }
    this.edit = !this.edit;
  }

  ngOnInit() {
  }

}
