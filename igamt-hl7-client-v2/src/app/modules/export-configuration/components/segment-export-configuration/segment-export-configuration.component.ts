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

  @Input()
  displayColumns: boolean;

  @Input()
  viewOnly: boolean;

  @Output()
  detectChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  triggerChange() {
    this.detectChange.emit(this.config);
  }

  applyChange(event: any) {
    this.config.deltaMode = event.active;
    this.config.deltaConfig = event.config;
    this.triggerChange();
  }

  print() {
  }
}
