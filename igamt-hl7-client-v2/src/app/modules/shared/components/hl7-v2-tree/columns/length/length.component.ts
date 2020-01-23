import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChangeType, PropertyType } from 'src/app/modules/shared/models/save-change';
import { LengthType } from '../../../../constants/length-type.enum';
import { ILengthRange } from '../../hl7-v2-tree.component';
import { HL7v2TreeColumnComponent } from '../hl7-v2-tree-column.component';

@Component({
  selector: 'app-length',
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
    };
  }

  constructor() {
    super([PropertyType.LENGTHMIN, PropertyType.LENGTHMAX, PropertyType.LENGTHTYPE]);
    this.updateLengthType = new EventEmitter();
    this.value$.subscribe((live) => {
      this.val = live;
    });
  }

  minChange(value: string) {
    this.onChange<string>(this.getInputValue().length.min + '', value + '', PropertyType.LENGTHMIN, ChangeType.UPDATE);
  }

  maxChange(value: string) {
    this.onChange<string>(this.getInputValue().length.max + '', value + '', PropertyType.LENGTHMAX, ChangeType.UPDATE);
  }

  clear() {
    this.onChange<string>(this.getInputValue().lengthType, LengthType.ConfLength, PropertyType.LENGTHTYPE, ChangeType.UPDATE);
    this.updateLengthType.emit(LengthType.ConfLength);
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
