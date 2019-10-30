import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-datatype-export-configuration',
  templateUrl: './datatype-export-configuration.component.html',
  styleUrls: ['./datatype-export-configuration.component.scss'],
})
export class DatatypeExportConfigurationComponent implements OnInit {

  @Input()
  config: any;
  @Output()
  detectChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  triggerChange() {
    this.detectChange.emit(this.config);
  }

  print() {
  }
}
