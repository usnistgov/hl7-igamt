import {Component, Input, Output, EventEmitter} from "@angular/core";
import {GeneralConfigurationService} from "../../../service/general-configuration/general-configuration.service";
import { ControlContainer, NgForm } from '@angular/forms';
import * as __ from 'lodash';
import {ConstraintsService} from "../../../igdocuments/igdocument-edit/service/constraints.service";

@Component({
  selector : 'predicate-col',
  templateUrl : './predicate-col.component.html',
  styleUrls : ['./predicate-col.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})

export class PredicateColComponent {
  @Input() viewScope: string;
  @Input() sourceId: string;

  @Input() predicate: any;
  @Output() predicateChange = new EventEmitter<any[]>();

  @Input() trueUsage: string;
  @Output() trueUsageChange = new EventEmitter<string>();

  @Input() falseUsage: string;
  @Output() falseUsageChange = new EventEmitter<string>();

  @Input() structure: any;

  @Input() changeItems: any[];
  @Output() changeItemsChange = new EventEmitter<any[]>();

  @Input() idPath : string;

  cUsages:any;
  cpEditor:boolean = false;

  constraintTypes: any = [];
  assertionModes: any = [];
  selectedCP:any = {};
  backupCS:any;

  constructor(private configService : GeneralConfigurationService, private constraintsService: ConstraintsService){}

  ngOnInit(){
    this.cUsages = this.configService._cUsages;
    this.constraintTypes = this.configService._predicateTypes;
    this.assertionModes = this.configService._assertionModes;
  }

  deletePredicate(){
    let item:any = {};
    item.location = this.idPath;
    item.propertyType = 'PREDICATE';
    item.propertyValue = null;
    item.changeType = "DELETE";
    this.changeItems.push(item);
    this.changeItemsChange.emit(this.changeItems);
    this.predicate = null;
    this.trueUsage = null;
    this.falseUsage = null;
    this.trueUsageChange.emit(this.trueUsage);
    this.falseUsageChange.emit(this.falseUsage);
    this.predicateChange.emit(this.predicate);
  }

  editPredicate(){
    this.selectedCP = __.cloneDeep(this.predicate);
    if(!this.selectedCP) this.selectedCP = {};
    this.backupCS = __.cloneDeep(this.selectedCP);

    if(!this.selectedCP.type) {

    }else {
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
    }

    this.cpEditor = true;
  }

  changeType(){
    if(this.selectedCP.displayType == 'simple'){
      this.selectedCP.assertion = {};
      this.selectedCP.type = "ASSERTION";
      this.selectedCP.assertion = {mode:"SIMPLE"};
      this.selectedCP.freeText = undefined;
    }else if(this.selectedCP.displayType == 'free'){
      this.selectedCP.assertion = undefined;
      this.selectedCP.type = "FREE";
    }else if(this.selectedCP.displayType == 'complex'){
      this.selectedCP.freeText = undefined;
      this.selectedCP.assertion = {};
      this.selectedCP.type = "ASSERTION";
    }
  }

  submitCP() {
    this.trueUsageChange.emit(this.trueUsage);
    this.falseUsageChange.emit(this.falseUsage);

    this.selectedCP.displayType = undefined;
    this.selectedCP.trueUsage = this.trueUsage;
    this.selectedCP.falseUsage = this.falseUsage;
    if(this.selectedCP.type === 'ASSERTION') {
      this.constraintsService.generateDescriptionForSimpleAssertion(this.selectedCP.assertion, this.structure, 'D');
      this.selectedCP.assertion.description = 'IF ' + this.selectedCP.assertion.description;

    }

    if(this.predicate && this.predicate.type){
      let item:any = {};
      item.location = this.idPath;
      item.propertyType = 'PREDICATE';
      item.propertyValue = this.selectedCP;
      item.changeType = "UPDATE";
      this.changeItems.push(item);
    }else{
      let item:any = {};
      item.location = this.idPath;
      item.propertyType = 'PREDICATE';
      item.propertyValue = this.selectedCP;
      item.changeType = "ADD";
      this.changeItems.push(item);
    }
    this.changeItemsChange.emit(this.changeItems);
    this.predicate = __.cloneDeep(this.selectedCP);
    this.predicateChange.emit(this.predicate);
    this.selectedCP = {};
    this.cpEditor = false;
  }
}