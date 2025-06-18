import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
    this.val = value;
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
    this.applyToTarget<ISubStructElement>((elm) => {
      elm.minLength = value + '';
    });
  }

  maxChange(value: string) {
    this.onChange<string>(this.getInputValue().max + '', value + '', PropertyType.LENGTHMAX, ChangeType.UPDATE);
    this.applyToTarget<ISubStructElement>((elm) => {
      elm.maxLength = value + '';
    });
  }

  clear() {
    this.onChange<string>(this.lengthType, LengthType.UNSET, PropertyType.LENGTHTYPE, ChangeType.UPDATE);
    this.applyToTarget<ISubStructElement>((elm) => {
      elm.lengthType = LengthType.UNSET;
    });
    this.updateLengthType.emit(LengthType.UNSET);
  }

  set() {
    this.onChange<string>(this.lengthType, LengthType.Length, PropertyType.LENGTHTYPE, ChangeType.UPDATE);
    this.applyToTarget<ISubStructElement>((elm) => {
      elm.lengthType = LengthType.Length;
    });
    this.updateLengthType.emit(LengthType.Length);
  }

  isActualChange<X>(change: IChange<X>): boolean {
    return change.propertyValue !== change.oldPropertyValue;
  }

  ngOnInit() {
  }

}
