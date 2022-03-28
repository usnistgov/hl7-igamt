import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { filter, map, takeWhile } from 'rxjs/operators';
import { IChange, PropertyType } from 'src/app/modules/shared/models/save-change';
import { Usage } from '../../../../constants/usage.enum';
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
  alive = true;
  @Input()
  usage: Usage;

  constructor(dialog: MatDialog) {
    super([PropertyType.CARDINALITYMAX, PropertyType.CARDINALITYMIN], dialog);
    this.value$.subscribe(
      (value) => {
        this.range = value;
      },
    );
  }

  hasValue(range) {
    return range && range.min !== undefined && range.max !== undefined;
  }

  minChange(value: number, skipReason: boolean = false) {
    this.onChange<number>(this.getInputValue().min, value, PropertyType.CARDINALITYMIN, ChangeType.UPDATE, skipReason);
  }

  maxChange(value: string, skipReason: boolean = false) {
    this.onChange<string>(this.getInputValue().max, value, PropertyType.CARDINALITYMAX, ChangeType.UPDATE, skipReason);
  }

  isActualChange<X>(change: IChange<X>): boolean {
    return change.propertyValue !== change.oldPropertyValue;
  }

  ngOnInit() {
    this.changeEvent.pipe(
      takeWhile(() => this.alive),
      filter((change) => change.propertyType === PropertyType.USAGE && change.location === this.location),
      map((change) => {
        this.usage = change.propertyValue;
        if (change.propertyValue === Usage.R && this.range && this.range.min === 0) {
          this.range.min = 1;
          this.minChange(1, true);
        } else if (change.propertyValue === Usage.O && this.range && this.range.min > 0) {
          this.range.min = 0;
          this.minChange(0, true);
        }
      }),
    ).subscribe();
  }

}
