import {Component, Input} from "@angular/core";
import * as __ from 'lodash';

@Component({
  selector : 'valueset-readonly-col',
  templateUrl : './valueset-readonly-col.component.html',
  styleUrls : ['./valueset-readonly-col.component.css']
})
export class ValuesetReadonlyColComponent {
  @Input() bindings: any[];

  currentBindings: any;

  constructor() {
  }

  ngOnInit() {
    this.initCurrentBinding();
  }

  initCurrentBinding() {
    this.currentBindings = null;
    if (this.bindings) {
      for (var i in this.bindings) {
        if (this.bindings[i].valuesetBindings && this.bindings[i].valuesetBindings.length > 0) {
          if (!this.currentBindings) this.currentBindings = __.cloneDeep(this.bindings[i]);
          else {
            if (this.currentBindings.priority > this.bindings[i].priority) this.currentBindings = __.cloneDeep(this.bindings[i]);
          }
        }
      }
    }
  }
}
