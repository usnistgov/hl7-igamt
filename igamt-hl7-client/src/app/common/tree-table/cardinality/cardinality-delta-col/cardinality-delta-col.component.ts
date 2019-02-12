import {Component, Input, OnInit} from '@angular/core';
import {DeltaOperation} from '../../../delta/delta-display/delta-display.component';

@Component({
  selector: 'app-cardinality-delta-col',
  templateUrl: './cardinality-delta-col.component.html',
  styleUrls: ['./cardinality-delta-col.component.css']
})
export class CardinalityDeltaColComponent implements OnInit {

  _min: any;
  _max: any;

  constructor() { }

  @Input() set min(m: any) {
    this._min = m;
  }

  @Input() set max(m: any) {
    this._max = m;
  }

  deltaOp(): DeltaOperation {
    if ( this._min['_.operation'] === 'UNCHANGED' && this._max['_.operation'] === 'UNCHANGED') {
      return 'UNCHANGED';
    }
    return 'UPDATED';
  }

  ngOnInit() {
  }

}
