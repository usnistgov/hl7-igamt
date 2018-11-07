import {Component, Input, Output, EventEmitter} from "@angular/core";
import { _ } from 'underscore';
import * as __ from 'lodash';

@Component({
  selector : 'constantvalue-col',
  templateUrl : './constantvalue-col.component.html',
  styleUrls : ['./constantvalue-col.component.css']
})

export class ConstantValueColComponent {
  @Input() bindings: any[];
  @Output() bindingsChange = new EventEmitter<any[]>();

  @Input() idPath : string;
  @Input() viewScope: string;
  @Input() sourceId : string;

  @Input() changeItems: any[];
  @Output() changeItemsChange = new EventEmitter<any[]>();

  currentBindings: any;
  backup:any;

  constantvalueEditDialogOpen:boolean = false;

  constructor(){}

  ngOnInit(){
    this.initCurrentBinding();
  }

  editConstantValueBindings(){
    this.constantvalueEditDialogOpen = true;
    if(this.currentBindings) this.backup = __.cloneDeep(this.currentBindings);
    if(!this.currentBindings || this.currentBindings.priority !== 1){
      this.currentBindings = {};
      this.currentBindings.priority = 1;
      this.currentBindings.sourceType = this.viewScope;
      this.currentBindings.sourceId = this.sourceId;
      this.currentBindings.constantValue = null;
    }
  }

  deleteConstantValue(){
    this.currentBindings.constantValue = null;
    this.updateConstantValueBinding();
  }

  updateConstantValueBinding(){
    if(!this.bindings) this.bindings = [];
    var binding = this.findTargetBinding();
    if(!binding) this.bindings.push(this.currentBindings);
    else binding.constantValue = this.currentBindings.constantValue;
    this.initCurrentBinding();
    this.bindingsChange.emit(this.bindings);


    let item:any = {};
    item.location = this.idPath;
    item.propertyType = 'CONSTANTVALUE';
    item.propertyValue = this.findTargetBinding().constantValue;
    item.changeType = "UPDATE";
    this.changeItems.push(item);
    this.changeItemsChange.emit(this.changeItems);
  }

  resetConstantValue(){
    this.currentBindings = this.backup;
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

  findTargetBinding(){
    if(this.bindings){
      for (var i in this.bindings) {
        if(this.bindings[i].priority === 1) return this.bindings[i];
      }
      return null;
    }
  }
}