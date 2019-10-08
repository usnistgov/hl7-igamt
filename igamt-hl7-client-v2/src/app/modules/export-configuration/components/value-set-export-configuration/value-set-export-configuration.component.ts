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
