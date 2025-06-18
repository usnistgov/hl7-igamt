import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LengthType } from 'src/app/modules/shared/constants/length-type.enum';
import { IChange } from 'src/app/modules/shared/models/save-change';
import { IStringValue } from '../../../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { ChangeType, PropertyType } from '../../../../../shared/models/save-change';
import { ISubStructElement } from '../../../../../shared/models/structure-element.interface';
import { HL7v2TreeColumnComponent } from '../hl7-v2-tree-column.component';

@Component({
  selector: 'app-conformance-length-simplified',
  templateUrl: './conformance-length.component.html',
  styleUrls: ['./conformance-length.component.scss'],
})
export class ConformanceLengthComponent extends HL7v2TreeColumnComponent<IStringValue> implements OnInit {

  lengthTypes = LengthType;
  val: IStringValue;
  @Output()
  updateLengthType: EventEmitter<LengthType>;
  @Input()
  lengthType: LengthType;
  @Input()
  leaf: boolean;

  onInitValue(value: IStringValue): void {
    this.val = value;
  }

  constructor(protected dialog: MatDialog) {
    super([PropertyType.LENGTHTYPE, PropertyType.CONFLENGTH], dialog);
    this.updateLengthType = new EventEmitter();
    this.value$.subscribe((live) => {
      this.onInitValue(live);
    });
  }

  confLengthChange(value: string) {
    this.onChange<string>(this.getInputValue().value + '', value + '', PropertyType.CONFLENGTH, ChangeType.UPDATE);
    this.applyToTarget<ISubStructElement>((elm) => {
      elm.confLength = value + '';
    });
  }

  clear() {
    this.onChange<string>(this.getInputValue().value, LengthType.UNSET, PropertyType.LENGTHTYPE, ChangeType.UPDATE);
    this.applyToTarget<ISubStructElement>((elm) => {
      elm.lengthType = LengthType.UNSET;
    });
    this.updateLengthType.emit(LengthType.UNSET);
  }

  set() {
    this.onChange<string>(this.lengthType, LengthType.ConfLength, PropertyType.LENGTHTYPE, ChangeType.UPDATE);
    this.applyToTarget<ISubStructElement>((elm) => {
      elm.lengthType = LengthType.ConfLength;
    });
    this.updateLengthType.emit(LengthType.ConfLength);
  }

  isActualChange<X>(change: IChange<X>): boolean {
    return change.propertyValue !== change.oldPropertyValue;
  }

  ngOnInit() {
  }
}
