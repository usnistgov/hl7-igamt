import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash'
@Component({
  selector: 'app-segment-export-configuration',
  templateUrl: './segment-export-configuration.component.html',
  styleUrls: ['./segment-export-configuration.component.scss'],
})
export class SegmentExportConfigurationComponent implements OnInit {

  @Input()
  config: any;
  current: any;
  @Output()
  change: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    this.current = _.cloneDeep(this.config);
  }

  triggerChange() {
    console.log(this.current);
    this.change.emit(this.current);
  }

  print() {
    console.log(this.current);
  }
}
