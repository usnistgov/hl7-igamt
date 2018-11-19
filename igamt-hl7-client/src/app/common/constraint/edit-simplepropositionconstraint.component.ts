/**
 * Created by Jungyub on 10/26/17.
 */
import {Component, Input} from "@angular/core";
import { ControlContainer, NgForm } from '@angular/forms';
import {GeneralConfigurationService} from "../../service/general-configuration/general-configuration.service";


@Component({
  selector : 'edit-simple-proposition-constraint',
  templateUrl : './edit-simplepropositionconstraint.component.html',
  styleUrls : ['./edit-simplepropositionconstraint.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class EditSimplePropositionConstraintComponent {
  @Input() constraint : any;
  @Input() ifAssertion : any;
  @Input() thenAssertion : any;
  @Input() structure : any;
  @Input() groupName: string;
  @Input() level: string;

  needContext:boolean = false;

  needPTargetOccurence:boolean = false;
  targetPOccurenceIdPath:string;
  targetPOccurenceLocationStr:string;
  targetPOccurenceValue:string;
  targetPOccurenceType:string;

  needTargetOccurence:boolean = false;
  targetOccurenceIdPath:string;
  targetOccurenceLocationStr:string;
  targetOccurenceValue:string;
  targetOccurenceType:string;

  needCompareOccurence:boolean = false;
  compareOccurenceIdPath:string;
  compareOccurenceLocationStr:string;
  compareOccurenceValue:string;
  compareOccurenceType:string;


  needComparison:boolean = false;

  verbs: any[];
  occurenceTypes:any[];
  declarativeTypes:any[];
  declarativeCTypes:any[];

  constructor(private configService : GeneralConfigurationService){}

  ngOnInit(){
    if(!this.ifAssertion) this.ifAssertion = {};
    if(!this.ifAssertion.complement) this.ifAssertion.complement = {};
    if(!this.ifAssertion.subject) this.ifAssertion.subject = {};
    if(!this.thenAssertion) this.thenAssertion = {};
    if(!this.thenAssertion.complement) this.thenAssertion.complement = {};
    if(!this.thenAssertion.subject) this.thenAssertion.subject = {};
    this.verbs = this.configService._simpleConstraintVerbs;
    this.occurenceTypes = this.configService._occurenceTypes;
    this.declarativeTypes = this.configService._declarativeTypes;
    this.declarativeCTypes = this.configService._declarativeCTypes;

    if(this.level === 'CONFORMANCEPROFILE'){
      this.needContext = true;
    }
  }

  selectPTargetElementLocation(location){
    this.needPTargetOccurence = false;
    this.targetPOccurenceIdPath = null;
    this.targetPOccurenceLocationStr = null;
    this.targetPOccurenceValue = null;
    this.targetPOccurenceType = null;
    this.ifAssertion.subject = {path:location};
  }

  selectTargetElementLocation(location){
    this.needTargetOccurence = false;
    this.targetOccurenceIdPath = null;
    this.targetOccurenceLocationStr = null;
    this.targetOccurenceValue = null;
    this.targetOccurenceType = null;
    this.thenAssertion.subject = {path:location};
  }

  selectComparisonElementLocation(location){
    this.needCompareOccurence = false;
    this.compareOccurenceIdPath = null;
    this.compareOccurenceLocationStr = null;
    this.compareOccurenceValue = null;
    this.compareOccurenceType = null;
    this.thenAssertion.complement.path = location;
  }

  getLocationLabel(location, type){
    if(location.path){
      let result:string = this.structure.name;
      result = this.getChildLocation(location.path.child, this.structure.structure, result, null, type);
      return result;
    }
    return null;
  }

  getChildLocation(path, list, result, elementName, type){
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

          if(item.data.max && item.data.max !== '0' && item.data.max !== '1'){
            if(type === 'TARGET'){
              if(!this.needTargetOccurence){
                this.needTargetOccurence = true;
                this.targetOccurenceIdPath = item.data.idPath;
                this.targetOccurenceLocationStr = result + "(" + elementName + ")";
              }
            }else{
              if(!this.needCompareOccurence){
                this.needCompareOccurence = true;
                this.compareOccurenceIdPath = item.data.idPath;
                this.compareOccurenceLocationStr = result + "(" + elementName + ")";
              }
            }
          }
          return this.getChildLocation(path.child,item.children, result, elementName, type);
        }
      }
    }
    return result + "(" + elementName + ")";
  }

  // addListValue(list){
  //   if(!list) list = [];
  //   list.push('');
  // }

  changeDeclarativeType(){
    if(this.thenAssertion.complement.complementKey === 'containListValues' || this.thenAssertion.complement.complementKey === 'containListCodes')
      this.thenAssertion.complement.values = [];
  }
}
