import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';
import { IStringValue } from '../../../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../../../../../shared/constants/type.enum';
import { Usage } from '../../../../../shared/constants/usage.enum';
import { Hl7Config } from '../../../../../shared/models/config.class';
import { ChangeType, PropertyType } from '../../../../../shared/models/save-change';
import { IStructureElement } from '../../../../../shared/models/structure-element.interface';
import { HL7v2TreeColumnComponent } from '../hl7-v2-tree-column.component';

export interface IUsageOption {
  label: string;
  value: Usage;
}

@Component({
  selector: 'app-usage-simplified',
  templateUrl: './usage.component.html',
  styleUrls: ['./usage.component.scss'],
})
export class UsageComponent extends HL7v2TreeColumnComponent<IStringValue> implements OnInit {

  options: IUsageOption[];

  usage: IStringValue;
  @Input()
  anchor: TemplateRef<any>;
  @Input()
  context: Type;

  @Input()
  set usages({ original, config }: { original: Usage, config: Hl7Config }) {
    const includeW = original === 'W';
    const includeB = original === 'B';
    this.options = Hl7Config.getUsageOptions(config.usages, includeW, includeB).filter((u) => u.value !== Usage.CAB);
  }

  constructor(dialog: MatDialog) {
    super([PropertyType.USAGE], dialog);
    this.value$.asObservable().subscribe(
      (value) => {
        this.usage = value;
      },
    );
  }

  modelChange(event: any): void {
    this.onChange<string>(this.getInputValue().value, event.value, PropertyType.USAGE, ChangeType.UPDATE);
    this.applyToTarget<IStructureElement>((elm) => {
      elm.usage = event.value;
    });
  }

  ngOnInit() {
  }

}
