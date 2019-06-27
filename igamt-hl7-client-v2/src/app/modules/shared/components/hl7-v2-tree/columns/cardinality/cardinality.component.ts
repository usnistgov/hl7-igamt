import { Component, OnInit, ViewChild } from '@angular/core';
import { PropertyType } from 'src/app/modules/shared/models/save-change';
import { ChangeType } from '../../../../models/save-change';
import { ICardinalityRange } from '../../hl7-v2-tree.component';
import { HL7v2TreeColumnComponent } from '../hl7-v2-tree-column.component';

@Component({
  selector: 'app-cardinality',
  templateUrl: './cardinality.component.html',
  styleUrls: ['./cardinality.component.scss'],
})
export class CardinalityComponent extends HL7v2TreeColumnComponent<ICardinalityRange> implements OnInit {

  range: ICardinalityRange;
  @ViewChild('cardinalityForm') form;

  constructor() {
    super([PropertyType.CARDINALITYMAX, PropertyType.CARDINALITYMIN]);
    this.value$.subscribe(
      (value) => {
        this.range = { ...value };
      },
    );
  }

  onInitValue(value: ICardinalityRange): void {
    this.range = { ...value };
  }

  minChange(value: number) {
    console.log(this.form);
    this.onChange<number>(this.getInputValue().min, value, PropertyType.CARDINALITYMIN, ChangeType.UPDATE);
  }

  maxChange(value: string) {
    this.onChange<string>(this.getInputValue().max, value, PropertyType.CARDINALITYMAX, ChangeType.UPDATE);
  }

  ngOnInit() {
  }

}
