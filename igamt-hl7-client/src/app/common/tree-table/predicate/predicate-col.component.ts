import {Component, Input, Output, EventEmitter} from "@angular/core";
import {GeneralConfigurationService} from "../../../service/general-configuration/general-configuration.service";
import { ControlContainer, NgForm } from '@angular/forms';
import * as __ from 'lodash';

@Component({
  selector : 'predicate-col',
  templateUrl : './predicate-col.component.html',
  styleUrls : ['./predicate-col.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})

export class PredicateColComponent {
  @Input() viewScope: string;
  @Input() sourceId: string;

  @Input() bindings: any[];
  @Output() bindingsChange = new EventEmitter<any[]>();

  @Input() structure: any;

  @Input() changeItems: any[];
  @Output() changeItemsChange = new EventEmitter<any[]>();

  @Input() idPath : string;

  cUsages:any;
  cpEditor:boolean = false;

  currentPredicate:any;
  currentPredicatePriority:number = 100;
  currentPredicateSourceId:any;
  currentPredicateSourceType:any;

  constraintTypes: any = [];
  assertionModes: any = [];
  selectedCP:any = {};
  backupCS:any;

  // onUsageChange() {
  //   let item:any = {};
  //   item.location = this.idPath;
  //   item.propertyType = 'USAGE';
  //   item.propertyValue = this.usage;
  //   item.changeType = "UPDATE";
  //   this.changeItems.push(item);
  //
  //   if(this.usage === 'C') this.setPredicate();
  //   else if(this.usage !== 'C') this.deletePredicate();
  //   this.bindingsChange.emit(this.bindings);
  //   this.changeItemsChange.emit(this.changeItems);
  // }

  constructor(private configService : GeneralConfigurationService){}

  ngOnInit(){
    this.cUsages = this.configService._cUsages;
    this.constraintTypes = this.configService._predicateTypes;
    this.assertionModes = this.configService._assertionModes;
    this.setPredicate();
  }

  async setPredicate(){
    if(!this.bindings) this.bindings = [];

    var binding:any = this.findBindingByViewScope();
    if(!binding) {
      binding = {};
      binding.priority = 1;
      binding.sourceId = this.sourceId;
      binding.sourceType = this.viewScope;
      this.bindings.push(binding);
    }

    if(!binding.predicate) binding.predicate = {};

    this.currentPredicate = binding.predicate;
    this.currentPredicatePriority = 1;
    this.currentPredicateSourceId = this.sourceId;
    this.currentPredicateSourceType = this.viewScope;
  }

  deletePredicate(){
    if(this.bindings){
      var binding:any = this.findBindingByViewScope();
      if(binding) {
        binding.predicate = null;
        this.currentPredicate = binding.predicate;
        this.currentPredicatePriority = null;
        this.currentPredicateSourceId = null;
        this.currentPredicateSourceType = null;
      }
    }
  }

  findBindingByViewScope(){
    for (var i in this.bindings) {
      if(this.bindings[i].sourceType === this.viewScope) return this.bindings[i];
    }
    return null;
  }

  editPredicate(){
    this.selectedCP = __.cloneDeep(this.currentPredicate);
    this.backupCS = __.cloneDeep(this.currentPredicate);

    if(this.selectedCP.type === 'FREE'){
      this.selectedCP.displayType = 'free';
    }else if(this.selectedCP.type === 'ASSERTION' && this.selectedCP.assertion && this.selectedCP.assertion.mode === 'SIMPLE'){
      this.selectedCP.displayType = 'simple';
    }else if(this.selectedCP.type === 'ASSERTION' && this.selectedCP.assertion && this.selectedCP.assertion.mode === 'IFTHEN'
        && this.selectedCP.assertion.ifAssertion && this.selectedCP.assertion.ifAssertion.mode === 'SIMPLE'
        && this.selectedCP.assertion.thenAssertion && this.selectedCP.assertion.thenAssertion.mode === 'SIMPLE'){
      this.selectedCP.displayType = 'simple-proposition';
    }else {
      this.selectedCP.displayType = 'complex';
    }

    this.cpEditor = true;
  }

  changeType(){
    if(this.selectedCP.displayType == 'simple'){
      this.selectedCP.assertion = {};
      this.selectedCP.type = "ASSERTION";
      this.selectedCP.assertion = {mode:"SIMPLE"};
    }else if(this.selectedCP.displayType == 'free'){
      this.selectedCP.assertion = undefined;
      this.selectedCP.type = "FREE";
    }else if(this.selectedCP.displayType == 'simple-proposition'){
      this.selectedCP.assertion = {};
      this.selectedCP.type = "ASSERTION";
      this.selectedCP.assertion = {mode:"IFTHEN"};
      this.selectedCP.assertion.ifAssertion = {mode:"SIMPLE"};
      this.selectedCP.assertion.thenAssertion = {mode:"SIMPLE"};
    }else if(this.selectedCP.displayType == 'complex'){
      this.selectedCP.assertion = {};
      this.selectedCP.type = "ASSERTION";
    }
  }
}