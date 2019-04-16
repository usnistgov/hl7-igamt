import {Component, Input, Output, EventEmitter} from "@angular/core";
import { _ } from 'underscore';
import * as __ from 'lodash';

@Component({
  selector : 'constantvalue-readonly-col',
  templateUrl : './constantvalue-readonly-col.component.html',
  styleUrls : ['./constantvalue-readonly-col.component.css']
})

export class ConstantValueReadonlyColComponent {
  @Input() bindings: any[];
  currentBindings: any;

  constructor(){}

  ngOnInit(){
    this.initCurrentBinding();
  }

  initCurrentBinding(){
    this.currentBindings = null;
    if(this.bindings){
      for (var i in this.bindings) {
        if(this.bindings[i].constantValue){
          if(!this.currentBindings) this.currentBindings = __.cloneDeep(this.bindings[i]);
          else {
            if(this.currentBindings.priority > this.bindings[i].priority) this.currentBindings = __.cloneDeep(this.bindings[i]);
          }
        }
      }
    }
  }
}