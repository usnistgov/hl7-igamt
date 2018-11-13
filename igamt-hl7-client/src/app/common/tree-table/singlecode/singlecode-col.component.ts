import {Component, Input, Output, EventEmitter} from "@angular/core";
import { _ } from 'underscore';
import * as __ from 'lodash';

@Component({
  selector : 'singlecode-col',
  templateUrl : './singlecode-col.component.html',
  styleUrls : ['./singlecode-col.component.css']
})

export class SingleCodeColComponent {
  @Input() bindings: any[];
  @Output() bindingsChange = new EventEmitter<any[]>();

  @Input() idPath : string;
  @Input() viewScope: string;
  @Input() sourceId : string;

  @Input() changeItems: any[];
  @Output() changeItemsChange = new EventEmitter<any[]>();

  currentBindings: any;
  backup:any;

  singlecodeEditDialogOpen:boolean = false;

  constructor(){}

  ngOnInit(){
    this.initCurrentBinding();
  }

  editSinglecodeBindings(){
    this.singlecodeEditDialogOpen = true;
    if(this.currentBindings) this.backup = __.cloneDeep(this.currentBindings);
    if(!this.currentBindings || this.currentBindings.priority !== 1){
      this.currentBindings = {};
      this.currentBindings.priority = 1;
      this.currentBindings.sourceType = this.viewScope;
      this.currentBindings.sourceId = this.sourceId;
      this.currentBindings.externalSingleCode = {};
    }
  }

  deleteSingleCode(){
    this.currentBindings.externalSingleCode = null;
    this.updateSinglecodeBinding();
  }

  updateSinglecodeBinding(){
    if(!this.bindings) this.bindings = [];
    var binding = this.findTargetBinding();
    if(!binding) this.bindings.push(this.currentBindings);
    else binding.externalSingleCode = __.cloneDeep(this.currentBindings.externalSingleCode);
    this.initCurrentBinding();
    this.bindingsChange.emit(this.bindings);


    let item:any = {};
    item.location = this.idPath;
    item.propertyType = 'SINGLECODE';
    item.propertyValue = this.findTargetBinding().externalSingleCode;
    item.changeType = "UPDATE";
    this.changeItems.push(item);
    this.changeItemsChange.emit(this.changeItems);
  }

  resetSingleCodeBinding(){
    this.currentBindings = this.backup;
  }

  initCurrentBinding(){
    this.currentBindings = null;
    if(this.bindings){
      for (var i in this.bindings) {
        if(this.bindings[i].externalSingleCode && this.bindings[i].externalSingleCode.value && this.bindings[i].externalSingleCode.codeSystem){
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