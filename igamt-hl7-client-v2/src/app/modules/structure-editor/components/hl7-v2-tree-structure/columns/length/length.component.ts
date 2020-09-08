import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ChangeType, IChange, PropertyType } from 'src/app/modules/shared/models/save-change';
import { ILengthRange } from '../../../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { LengthType } from '../../../../../shared/constants/length-type.enum';
import { ISubStructElement } from '../../../../../shared/models/structure-element.interface';
import { HL7v2TreeColumnComponent } from '../hl7-v2-tree-column.component';

@Component({
  selector: 'app-length-simplified',
  templateUrl: './length.component.html',
  styleUrls: ['./length.component.scss'],
})
export class LengthComponent extends HL7v2TreeColumnComponent<ILengthAndConfLength> implements OnInit {

  val: ILengthAndConfLength;
  @Output()
  updateLengthType: EventEmitter<LengthType>;

  onInitValue(value: ILengthAndConfLength): void {
    this.val = {
      ...value,
      length: value && value.length ? {
        ...value.length,
      } : undefined,
    };
  }

  constructor(protected dialog: MatDialog) {
    super([PropertyType.LENGTHMIN, PropertyType.LENGTHMAX, PropertyType.LENGTHTYPE], dialog);
    this.updateLengthType = new EventEmitter();
    this.value$.subscribe((live) => {
      this.onInitValue(live);
    });
  }

  minChange(value: string) {
    this.onChange<string>(this.getInputValue().length.min + '', value + '', PropertyType.LENGTHMIN, ChangeType.UPDATE);
    this.applyToTarget<ISubStructElement>((elm) => {
      elm.minLength = value + '';
    });
  }

  maxChange(value: string) {
    this.onChange<string>(this.getInputValue().length.max + '', value + '', PropertyType.LENGTHMAX, ChangeType.UPDATE);
    this.applyToTarget<ISubStructElement>((elm) => {
      elm.maxLength = value + '';
    });
  }

  clear() {
    this.onChange<string>(this.getInputValue().lengthType, LengthType.ConfLength, PropertyType.LENGTHTYPE, ChangeType.UPDATE);
    this.applyToTarget<ISubStructElement>((elm) => {
      elm.lengthType = LengthType.ConfLength;
    });
    this.updateLengthType.emit(LengthType.ConfLength);
  }

  isActualChange<X>(change: IChange<X>): boolean {
    return change.propertyValue !== change.oldPropertyValue;
  }

  active() {
    return this.val.lengthType === LengthType.Length;
  }

  ngOnInit() {
  }

}

export interface ILengthAndConfLength {
  length: ILengthRange;
  confLength: string;
  lengthType: LengthType;
}
