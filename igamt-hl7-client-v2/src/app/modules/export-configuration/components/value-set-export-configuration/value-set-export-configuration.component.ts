import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-value-set-export-configuration',
  templateUrl: './value-set-export-configuration.component.html',
  styleUrls: ['./value-set-export-configuration.component.scss'],
})
export class ValueSetExportConfigurationComponent implements OnInit {

  @Input()
  config: any;

  @Input()
  displayColumns: boolean;

  @Input()
  viewOnly: boolean;

  @Input()
  derived: boolean;

  @Output()
  detectChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    console.log(this.config);
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
