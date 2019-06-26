import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  remove: EventEmitter<ILengthAndConfLength>;

  onInitValue(value: ILengthAndConfLength): void {
    this.val = {
      ...value,
    };
  }

  constructor() {
    super([PropertyType.LENGTHMIN, PropertyType.LENGTHMAX, PropertyType.CONFLENGTH]);
    this.remove = new EventEmitter();
    this.value$.subscribe((live) => {
      this.val = live;
    });
  }

  confLengthChange(value: string) {
    this.onChange<string>(this.getInputValue().confLength + '', value + '', PropertyType.CONFLENGTH, ChangeType.UPDATE);
  }

  clear() {
    this.onChange<string>(this.getInputValue().length.min + '', '0', PropertyType.LENGTHMIN, ChangeType.UPDATE);
    this.onChange<string>(this.getInputValue().length.max + '', '*', PropertyType.LENGTHMAX, ChangeType.UPDATE);
    this.onChange<string>(this.getInputValue().confLength + '', 'NA', PropertyType.CONFLENGTH, ChangeType.UPDATE);

    this.val = {
      length: {
        min: '0',
        max: '*',
      },
      confLength: 'NA',
    };

    this.remove.emit(this.val);
  }

  ngOnInit() {
  }
}
