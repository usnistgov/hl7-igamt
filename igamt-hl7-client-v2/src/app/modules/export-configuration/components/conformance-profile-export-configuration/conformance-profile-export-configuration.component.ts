import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {TabViewModule} from 'primeng/tabview';
import {CardModule} from 'primeng/card';


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
  displayColumns : boolean;

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
