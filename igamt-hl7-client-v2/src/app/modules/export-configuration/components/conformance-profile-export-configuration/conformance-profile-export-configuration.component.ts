import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash'

@Component({
  selector: 'app-conformance-profile-export-configuration',
  templateUrl: './conformance-profile-export-configuration.component.html',
  styleUrls: ['./conformance-profile-export-configuration.component.scss'],
})
export class ConformanceProfileExportConfigurationComponent implements OnInit {

  
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
