import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LengthType } from 'src/app/modules/shared/constants/length-type.enum';
import { IChange } from 'src/app/modules/shared/models/save-change';
import { ChangeType, PropertyType } from '../../../../models/save-change';
import { HL7v2TreeColumnComponent } from '../hl7-v2-tree-column.component';
import { ILengthAndConfLength } from '../length/length.component';

@Component({
  selector: 'app-conformance-length',
  templateUrl: './conformance-length.component.html',
  styleUrls: ['./conformance-length.component.scss'],
})
export class ConformanceLengthComponent extends HL7v2TreeColumnComponent<ILengthAndConfLength> implements OnInit {

  val: ILengthAndConfLength;
  @Output()
  updateLengthType: EventEmitter<LengthType>;

  onInitValue(value: ILengthAndConfLength): void {
    this.val = {
      ...value,
      confLength: value && value.confLength ? value.confLength : undefined,
    };
  }

  constructor(protected dialog: MatDialog) {
    super([PropertyType.LENGTHTYPE, PropertyType.CONFLENGTH], dialog);
    this.updateLengthType = new EventEmitter();
    this.value$.subscribe((live) => {
      this.onInitValue(live);
    });
  }

  confLengthChange(value: string) {
    this.onChange<string>(this.getInputValue().confLength + '', value + '', PropertyType.CONFLENGTH, ChangeType.UPDATE);
  }

  clear() {
    this.onChange<string>(this.getInputValue().lengthType, LengthType.Length, PropertyType.LENGTHTYPE, ChangeType.UPDATE);
    this.updateLengthType.emit(LengthType.Length);
  }

  isActualChange<X>(change: IChange<X>): boolean {
    return change.propertyValue !== change.oldPropertyValue;
  }

  active() {
    return this.val.lengthType === LengthType.ConfLength;
  }

  ngOnInit() {
  }
}
