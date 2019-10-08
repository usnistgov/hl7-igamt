import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
@Component({
  selector: 'app-segment-export-configuration',
  templateUrl: './segment-export-configuration.component.html',
  styleUrls: ['./segment-export-configuration.component.scss'],
})
export class SegmentExportConfigurationComponent implements OnInit {

  @Input()
  config: any;
  @Output()
  change: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  triggerChange() {
    this.change.emit(this.config);
  }

  print() {
  }
}
