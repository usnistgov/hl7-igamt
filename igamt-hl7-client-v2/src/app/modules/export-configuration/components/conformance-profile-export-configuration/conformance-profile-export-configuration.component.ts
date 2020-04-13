import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {CardModule} from 'primeng/card';
import {TabViewModule} from 'primeng/tabview';

import * as _ from 'lodash';

@Component({
  selector: 'app-conformance-profile-export-configuration',
  templateUrl: './conformance-profile-export-configuration.component.html',
  styleUrls: ['./conformance-profile-export-configuration.component.scss'],
})
export class ConformanceProfileExportConfigurationComponent implements OnInit {

  @Input()
  config: any;

  @Input()
  viewOnly: boolean;

  @Input()
  displayColumns: boolean;

  @Output()
  detectChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  triggerChange() {
    this.detectChange.emit(this.config);
  }
  applyChange(event: any) {
    console.log(event);
    this.config.deltaMode = event.active;
    this.config.deltaConfig = event.config;
    this.triggerChange();
  }

  print() {
  }

}
