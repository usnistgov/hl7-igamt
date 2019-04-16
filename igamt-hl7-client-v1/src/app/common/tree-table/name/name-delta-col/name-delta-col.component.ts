import {Component, Input, OnInit} from '@angular/core';
import {DeltaOperation} from '../../../delta/delta-display/delta-display.component';

@Component({
  selector: 'app-name-delta-col',
  templateUrl: './name-delta-col.component.html',
  styleUrls: ['./name-delta-col.component.css']
})
export class NameDeltaColComponent implements OnInit {

  @Input() type: string;
  @Input() index: number;
  @Input() position : any;
  @Input() description : any;
  @Input() size : string;
  @Input() rowNode : any;
  @Input() elmDeltaOp : DeltaOperation;

  constructor() { }

  ngOnInit() {
  }

  deltaOp(): DeltaOperation {
    if ( this.position['_.operation'] === 'UNCHANGED' && this.description['_.operation'] === 'UNCHANGED') {
      return 'UNCHANGED';
    }
    return this.position['_.operation'];
  }

}
