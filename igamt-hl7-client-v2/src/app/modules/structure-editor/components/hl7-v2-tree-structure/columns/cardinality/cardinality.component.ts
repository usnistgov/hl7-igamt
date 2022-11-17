import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { filter, map, takeWhile } from 'rxjs/operators';
import { ICardinalityRange } from 'src/app/modules/shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { PropertyType } from 'src/app/modules/shared/models/save-change';
import { Usage } from '../../../../../shared/constants/usage.enum';
import { IMsgStructElement } from '../../../../../shared/models/conformance-profile.interface';
import { ChangeType } from '../../../../../shared/models/save-change';
import { IField } from '../../../../../shared/models/segment.interface';
import { HL7v2TreeColumnComponent } from '../hl7-v2-tree-column.component';

@Component({
  selector: 'app-cardinality-simplified',
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
        this.onInitValue(value);
      },
    );
  }

  onInitValue(value: ICardinalityRange): void {
    this.range = value;
  }

  hasValue(range) {
    return range && range.min !== undefined && range.max !== undefined;
  }

  minChange(value: number) {
    this.onChange<number>(this.getInputValue().min, value, PropertyType.CARDINALITYMIN, ChangeType.UPDATE);
    this.applyToTarget<IField | IMsgStructElement>((elm) => {
      elm.min = value;
    });
  }

  maxChange(value: string) {
    this.onChange<string>(this.getInputValue().max, value, PropertyType.CARDINALITYMAX, ChangeType.UPDATE);
    this.applyToTarget<IField | IMsgStructElement>((elm) => {
      elm.max = value;
    });
  }

  ngOnInit() {
    this.changeEvent.pipe(
      takeWhile(() => this.alive),
      filter((change) => change.propertyType === PropertyType.USAGE && change.location === this.location),
      map((change) => {
        this.usage = change.propertyValue;
        if (change.propertyValue === Usage.R && this.range && this.range.min === 0) {
          this.range.min = 1;
          this.minChange(1);
        } else if (change.propertyValue === Usage.O && this.range && this.range.min > 0) {
          this.range.min = 0;
          this.minChange(0);
        }
      }),
    ).subscribe();
  }

}
