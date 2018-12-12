/**
 * Created by Jungyub on 10/26/17.
 */
import {Component, Input} from "@angular/core";
import { ControlContainer, NgForm } from '@angular/forms';
import {GeneralConfigurationService} from "../../service/general-configuration/general-configuration.service";


@Component({
  selector : 'edit-simple-proposition',
  templateUrl : './edit-simpleproposition.component.html',
  styleUrls : ['./edit-simpleproposition.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class EditSimplePropositionComponent {
  @Input() constraint : any;
  @Input() assertion : any;
  @Input() structure : any;
  @Input() groupName: string;
  @Input() level: string;

  verbs: any[];
  occurenceTypes:any[];
  declarativeTypes:any[];

  constructor(private configService : GeneralConfigurationService){}

  ngOnInit(){
    if(!this.assertion) this.assertion = {};
    if(!this.assertion.complement) this.assertion.complement = {};
    if(!this.assertion.subject) this.assertion.subject = {};
    this.verbs = this.configService._propsotionVerbs;
    this.occurenceTypes = this.configService._occurenceTypes;
    this.declarativeTypes = this.configService._propsotionTypes;
  }

  selectTargetElementLocation(location){
    this.assertion.subject = {path:location};
    this.assertion.subject.occurenceIdPath = null;
    this.assertion.subject.occurenceLocationStr = null;
    this.assertion.subject.occurenceValue = null;
    this.assertion.subject.occurenceType = null;
  }

  getLocationLabel(location, type){
    if(location.path){
      let result:string = this.structure.name;
      result = this.getChildLocation(location.path.child, this.structure.structure, result, null, type);
      result = result.replace("undefined.", "");
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
            if(!this.assertion.subject.occurenceType){
              this.assertion.subject.occurenceType = 'TBD';
              this.assertion.subject.occurenceIdPath = item.data.idPath;
              this.assertion.subject.occurenceLocationStr = result + "(" + elementName + ")";
              this.assertion.subject.occurenceLocationStr = this.assertion.subject.occurenceLocationStr.replace("undefined.", "");
            }
          }
          return this.getChildLocation(path.child,item.children, result, elementName, type);
        }
      }
    }
    return result + "(" + elementName + ")";
  }

  addListValue(complement){
    console.log(complement);
    if(!complement.values) complement.values = [];
    complement.values.push('');
  }

  delValue(list, index){
    list.splice(index, 1);
  }

  changeDeclarativeType(){
    if(this.assertion.complement.complementKey === 'containListValues' || this.assertion.complement.complementKey === 'containListCodes')
      this.assertion.complement.values = [];
  }

  customTrackBy(index: number, obj: any): any {
    return  index;
  }
}
