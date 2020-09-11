import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import {CardModule} from 'primeng/card';
import {TabViewModule} from 'primeng/tabview';

@Component({
  selector: 'app-datatype-export-configuration',
  templateUrl: './datatype-export-configuration.component.html',
  styleUrls: ['./datatype-export-configuration.component.scss'],
})
export class DatatypeExportConfigurationComponent implements OnInit {

  @Input()
  config: any;

  @Input()
  displayColumns: boolean;

  @Input()
  viewOnly: boolean;

  @Input()
  derived: boolean;

  @Input()
  origin = null;

  @Input()
  delta: boolean;

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
