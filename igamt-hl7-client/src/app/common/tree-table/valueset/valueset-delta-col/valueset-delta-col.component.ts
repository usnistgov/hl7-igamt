import {Component, Input, OnInit} from '@angular/core';
import * as __ from 'lodash';
import {DeltaOperation} from '../../../delta/delta-display/delta-display.component';

@Component({
  selector: 'app-valueset-delta-col',
  templateUrl: './valueset-delta-col.component.html',
  styleUrls: ['./valueset-delta-col.component.css']
})
export class ValuesetDeltaColComponent implements OnInit {

  @Input() bindings: any[];

  currentBindings: any;
  noChange: any[] = [];
  added: any[] = [];
  deleted: any[] = [];

  constructor() { }

  ngOnInit() {
    this.initCurrentBinding();
    // console.log(this.currentBindings);
    if (this.currentBindings && this.currentBindings.valuesetBindings) {
      this.noChange = this.currentBindings.valuesetBindings.filter(elm => elm['_.operation'] === 'UNCHANGED');
      this.added = this.currentBindings.valuesetBindings.filter(elm => elm['_.operation'] === 'ADDED');
      this.deleted = this.currentBindings.valuesetBindings.filter(elm => elm['_.operation'] === 'DELETED');
    }
  }

  deltaOp(): DeltaOperation {
    if (this.added.length === 0 && this.deleted.length === 0) {
      return 'UNCHANGED';
    }
    return 'UPDATED';
  }

  initCurrentBinding() {
    this.currentBindings = null;
    if (this.bindings) {
      for (var i in this.bindings) {
        if (this.bindings[i].valuesetBindings && this.bindings[i].valuesetBindings.length > 0) {
          if (!this.currentBindings) {
            this.currentBindings = __.cloneDeep(this.bindings[i]);
          } else {
            if (this.currentBindings.priority > this.bindings[i].priority) {
              this.currentBindings = __.cloneDeep(this.bindings[i]);
            }
          }
        }
      }
    }
  }
}
