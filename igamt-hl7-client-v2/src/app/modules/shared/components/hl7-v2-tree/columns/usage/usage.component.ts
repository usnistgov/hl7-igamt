import { Component, OnInit } from '@angular/core';
import { ChangeType, PropertyType } from '../../../../models/save-change';
import { IStringValue } from '../../hl7-v2-tree.component';
import { HL7v2TreeColumnComponent } from '../hl7-v2-tree-column.component';

@Component({
  selector: 'app-usage',
  templateUrl: './usage.component.html',
  styleUrls: ['./usage.component.scss'],
})
export class UsageComponent extends HL7v2TreeColumnComponent<IStringValue> implements OnInit {

  options = [
    {
      label: 'R',
      value: 'R',
    },
    {
      label: 'O',
      value: 'O',
    },
    {
      label: 'C',
      value: 'C',
    },
  ];

  usage: IStringValue;

  constructor() {
    super([PropertyType.USAGE]);
    this.value$.asObservable().subscribe(
      (value) => {
        this.usage = {
          ...value,
        };
      },
    );
  }

  modelChange(event: any): void {
    this.onChange<string>(this.getInputValue().value, event.value, PropertyType.USAGE, ChangeType.UPDATE);
  }

  ngOnInit() {
  }

}
