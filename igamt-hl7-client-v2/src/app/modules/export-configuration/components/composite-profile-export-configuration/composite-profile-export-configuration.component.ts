import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';

import * as _ from 'lodash';

@Component({
  selector: 'app-composite-profile-export-configuration',
  templateUrl: './composite-profile-export-configuration.component.html',
  styleUrls: ['./composite-profile-export-configuration.component.css'],
})
export class CompositeProfileExportConfigurationComponent implements OnInit {

  @Input()
  config: any;

  @Input()
  viewOnly: boolean;

  @Input()
  derived: boolean;

  @Input()
  displayColumns: boolean;

  @Input()
  displayFlavors: boolean;

  @Input()
  origin = null;

  @Input()
  delta: boolean;

  @Input()
  differential: boolean;

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
