import {Component, Input, Output, EventEmitter} from "@angular/core";
import {GeneralConfigurationService} from "../../../service/general-configuration/general-configuration.service";
import { ControlContainer, NgForm } from '@angular/forms';
import * as __ from 'lodash';
import {ConstraintsService} from "../../../igdocuments/igdocument-edit/service/constraints.service";
import {ConformanceProfilesService} from "../../../igdocuments/igdocument-edit/conformanceprofile-edit/conformance-profiles.service";

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

  showContextTree : boolean = false;

  messageConformanceStatements:any;

  constructor(private configService : GeneralConfigurationService, private constraintsService: ConstraintsService, private conformanceProfilesService: ConformanceProfilesService){}

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

    console.log(this.viewScope);
    if(this.viewScope === 'CONFORMANCEPROFILE'){
      this.conformanceProfilesService.getConformanceProfileConformanceStatements(this.sourceId).then( data => {
        this.messageConformanceStatements = data;
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
      });
    } else {
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

  }

  changeType(){
    if(this.selectedCP.displayType == 'simple'){
      this.selectedCP.assertion = {};
      this.selectedCP.type = "ASSERTION";
      this.selectedCP.assertion = {mode:"SIMPLE"};
      this.selectedCP.freeText = undefined;
      this.selectedCP.assertionScript = undefined;
    }else if(this.selectedCP.displayType == 'free'){
      this.selectedCP.assertion = undefined;
      this.selectedCP.type = "FREE";
    }else if(this.selectedCP.displayType == 'complex'){
      this.selectedCP.freeText = undefined;
      this.selectedCP.assertionScript = undefined;
      this.selectedCP.assertion = {};
      this.selectedCP.type = "ASSERTION";
    }
  }

  isReadOnly(){
    if(!this.predicate) return false;
    if(this.predicate && this.predicate.identifier === this.idPath) return false;
    return true;
  }

  submitCP() {
    this.trueUsageChange.emit(this.trueUsage);
    this.falseUsageChange.emit(this.falseUsage);
    this.selectedCP.displayType = undefined;
    this.selectedCP.trueUsage = this.trueUsage;
    this.selectedCP.falseUsage = this.falseUsage;
    this.selectedCP.identifier = this.idPath;
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

  editContextTree(){
    this.showContextTree = true;
  }

  getLocationLabel(location){
    if(location){
      let result:string = this.messageConformanceStatements.label;
      result = this.getChildLocation(location.child, this.messageConformanceStatements.structure, result, null);
      return result;
    }
    return null;
  }

  getChildLocation(path, list, result, elementName){
    if(path && list){
      for(let item of list){
        if(item.data.id === path.elementId) {
          if(item.data.type === 'FIELD'){
            result = result + '-' + item.data.position;
          }else if(item.data.type === 'COMPONENT' || item.data.type === 'SUBCOMPONENT'){
            result = result + '.' + item.data.position;
          }else {
            result = result + '.' + item.data.name;
          }
          elementName = item.data.name;

          return this.getChildLocation(path.child,item.children, result, elementName);
        }
      }
    }
    return result;
  }

  selectTargetElementLocationForContext(location){
    let id = this.selectedCP.id;
    this.selectedCP = {};
    this.selectedCP.id = id;
    this.structure = null;
    if(location.child){
      this.selectedCP.context = location;
      this.conformanceProfilesService.getConformanceProfileContextStructure(this.sourceId, this.getIdList(this.selectedCP.context.child, null)).then(data => {
        this.structure = data;

      }, error => {
      });
    }else {
      this.selectedCP.context = null;
      this.conformanceProfilesService.getConformanceProfileStructure(this.sourceId).then(data => {
        this.structure = data;
      }, error => {
      });
    }
    this.showContextTree = false;

  }

  getIdList(object, result){
    console.log(object.elementId);
    console.log(result);
    if(object.elementId) {
      if(result){
        result = result + '-' + object.elementId;
      }else{
        result = object.elementId;
      }

      if(object.child){
        return this.getIdList(object.child, result)
      }else{
        return result;
      }
    }else {
      return result;
    }
  }

  discardEdit(){
    this.selectedCP = {};
    this.cpEditor = false;
  }

  resetEdit(){
    this.selectedCP = __.cloneDeep(this.backupCS);

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

    if(this.viewScope === 'CONFORMANCEPROFILE') {
      this.structure = null;
      if(this.selectedCP.context && this.selectedCP.context.child){
        this.conformanceProfilesService.getConformanceProfileContextStructure(this.sourceId, this.getIdList(this.selectedCP.context.child, null)).then(data => {
          this.structure = data;
        }, error => {
        });
      }else {
        this.conformanceProfilesService.getConformanceProfileStructure(this.sourceId).then(data => {
          this.structure = data;
          console.log(data);
        }, error => {
        });
      }
    }

  }
}