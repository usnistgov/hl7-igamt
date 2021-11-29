import {Component, Input, OnInit} from '@angular/core';
import {DeltaOperation} from '../../../delta/delta-display/delta-display.component';

@Component({
  selector: 'app-length-delta-col',
  templateUrl: './length-delta-col.component.html',
  styleUrls: ['./length-delta-col.component.css']
})
export class LengthDeltaColComponent implements OnInit {

  @Input() minLength: any;
  @Input() maxLength: any;
  @Input() leaf: any;

  constructor() { }

  ngOnInit() {
  }


  deltaOp(): DeltaOperation {
    if ( this.minLength['_.operation'] === 'UNCHANGED' && this.maxLength['_.operation'] === 'UNCHANGED') {
      return 'UNCHANGED';
    }
    return 'UPDATED';
  }

}
