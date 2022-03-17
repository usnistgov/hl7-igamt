import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ChangeType, IChange, PropertyType } from 'src/app/modules/shared/models/save-change';
import { LengthType } from '../../../../constants/length-type.enum';
import { ILengthRange } from '../../hl7-v2-tree.component';
import { HL7v2TreeColumnComponent } from '../hl7-v2-tree-column.component';

@Component({
  selector: 'app-length',
  templateUrl: './length.component.html',
  styleUrls: ['./length.component.scss'],
})
export class LengthComponent extends HL7v2TreeColumnComponent<ILengthRange> implements OnInit {

  lengthTypes = LengthType;

  val: ILengthRange;
  @Output()
  updateLengthType: EventEmitter<LengthType>;
  @Input()
  lengthType: LengthType;
  @Input()
  leaf: boolean;

  onInitValue(value: ILengthRange): void {
    this.val = {
      ...value,
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
    this.onChange<string>(this.getInputValue().min + '', value + '', PropertyType.LENGTHMIN, ChangeType.UPDATE);
  }

  maxChange(value: string) {
    this.onChange<string>(this.getInputValue().max + '', value + '', PropertyType.LENGTHMAX, ChangeType.UPDATE);
  }

  clear() {
    this.onChange<string>(this.lengthType, LengthType.UNSET, PropertyType.LENGTHTYPE, ChangeType.UPDATE);
    this.updateLengthType.emit(LengthType.UNSET);
  }

  set() {
    this.onChange<string>(this.lengthType, LengthType.Length, PropertyType.LENGTHTYPE, ChangeType.UPDATE);
    this.updateLengthType.emit(LengthType.Length);
  }

  isActualChange<X>(change: IChange<X>): boolean {
    return change.propertyValue !== change.oldPropertyValue;
  }

  ngOnInit() {
  }

}
