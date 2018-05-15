/**
 * Created by hnt5 on 11/2/17.
 */
import {Injectable} from "@angular/core";
@Injectable()
export class GeneralConfigurationService {

  //TODO ADDING OTHER CONFIG DATA
  _usages : any;

  _valueSetAllowedDTs : any;

  _valueSetAllowedComponents : any;

  _singleValueSetDTs: any;

  _valueSetAllowedFields:any;

  _valuesetStrengthOptions:any;

  _codedElementDTs:any;

  _simpleConstraintVerbs:any[];

  _ifConstraintVerbs:any[];

  _operators: any[];

  _formatTypes: any[];

  _simpleAssertionTypes: any[];

  _complexAssertionTypes: any[];

  _partialComplexAssertionTypes: any[];

  _assertionModes:any[];

  constructor(){

    this._complexAssertionTypes = [
      {label: 'IFTHEN', value: 'IFTHEN'},
      {label: 'AND/OR', value: 'ANDOR'},
      {label: 'NOT', value: 'NOT'}
    ];

    this._simpleAssertionTypes = [
      {
        label: 'Value',
        items: [
          {label: 'Simple Value', value: 'SAMEVALUE'},
          {label: 'List of Value', value: 'LISTVALUE'},
          {label: 'Formatted Value', value: 'FORMATTED'},
          {label: 'Presence', value: 'PRESENCE'}
        ]
      },
      {
        label: 'Comparison',
        items: [
          {label: 'Compare with other Node', value: 'COMPARENODE'},
          {label: 'Compare with value', value: 'COMPAREVALUE'}
        ]
      }
    ];

    this._assertionModes = [
      {label: 'Select Assertion Type', value: null},
      {label: 'Simple Assertion', value: 'SIMPLE'},
      {label: 'Complex Assertion', value: 'COMPLEX'}
    ];

    this._partialComplexAssertionTypes = [
      {label: 'AND/OR', value: 'ANDOR'},
      {label: 'NOT', value: 'NOT'}
    ];
    this._simpleConstraintVerbs = [ { label : 'SHALL', value : 'SHALL' },{ label : 'SHALL NOT', value : 'SHALL NOT' }];
    this._ifConstraintVerbs = [ { label : 'is', value : 'IS' },{ label : 'is NOT', value : 'is NOT' }];
    this._formatTypes = [ { label : 'be ISO format', value : 'iso' },{ label : 'be positive', value : 'positive' },{ label : 'be negative', value : 'negative' },{ label : 'be numeric', value : 'numeric' },{ label : 'be alphanumeric', value : 'alphanumeric' },{ label : 'be regrex', value : 'regrex' }];
    this._operators = [ { label : 'be identical to the content of', value : 'equal' },{ label : 'be greater to the value of', value : 'greater' },{ label : 'be less to the value of', value : 'less' },{ label : 'be same or greater to the value of', value : 'equalorgreater' },{ label : 'be same or less to the value of', value : 'equalorless' },{ label : 'be different to the value of', value : 'notequal' }];
    this._usages = [ { label : 'R', value : 'R' },{ label : 'RE', value : 'RE' },{ label : 'C', value : 'C' }, { label : 'X', value : 'O' }];
    this._valuesetStrengthOptions = [ { label : 'Select Strength', value : null},{ label : 'R', value : 'R' },{ label : 'S', value : 'S' },{ label : 'U', value : 'U' }];
    this._valueSetAllowedDTs = ["ID", "IS", "CE", "CF", "CWE", "CNE", "CSU","HD"];
    this._codedElementDTs = ["CE", "CF", "CWE", "CNE", "CSU"];
    this._singleValueSetDTs = ["ID", "IS", "ST", "NM", "HD"];
    this._valueSetAllowedFields =[
        {
          "segmentName": "PID",
          "location": 23,
          "type":"FIELD"
        }
    ];
    this._valueSetAllowedComponents =
    [
      {
        "dtName": "CNS",
        "location": 7
      },
      {
        "dtName": "CSU",
        "location": 11
      },
      {
        "dtName": "XON",
        "location": 10
      },
      {
        "dtName": "CSU",
        "location": 2
      },
      {
        "dtName": "LA2",
        "location": 12
      },
      {
        "dtName": "OSD",
        "location": 4
      },
      {
        "dtName": "AD",
        "location": 4
      },
      {
        "dtName": "LA2",
        "location": 11
      },
      {
        "dtName": "XAD",
        "location": 4
      },
      {
        "dtName": "AD",
        "location": 5
      },
      {
        "dtName": "XAD",
        "location": 3
      },
      {
        "dtName": "XON",
        "location": 3
      },
      {
        "dtName": "AD",
        "location": 3
      },
      {
        "dtName": "CSU",
        "location": 14
      },
      {
        "dtName": "LA2",
        "location": 13
      },
      {
        "dtName": "OSD",
        "location": 2
      },
      {
        "dtName": "XAD",
        "location": 5
      },
      {
        "dtName": "CSU",
        "location": 5
      }
    ];
  }

  get usages(){
    return this._usages;
  }


  get valueSetAllowedDTs(){
    return this._valueSetAllowedDTs;
  }

  get valueSetAllowedComponents(){
    return this._valueSetAllowedComponents;
  }

  isValueSetAllow(dtName, position, parrentDT, SegmentName, type){
    if(this._valueSetAllowedDTs.includes(dtName)) return true;
    if(this._valueSetAllowedFields.includes({
        "segmentName": SegmentName,
        "location": position,
        "type":type
    })) return true;

    if(this._valueSetAllowedComponents.includes({
          "dtName": parrentDT,
          "location": position
    })) return true;
    return false;
  }

  isMultipleValuseSetAllowed(dtName){
    if(this._singleValueSetDTs.includes(dtName)) return false;
    return true;
  }

  getValuesetLocations(dtName, version){
    if(this._codedElementDTs.includes(dtName)){
      if(['2.1', '2.2', '2.3', '2.3.1', '2.4', '2.5', '2.5.1', '2.6'].includes(version)) return [ { label : 'Select Location', value : null},{ label : '1', value : [1] },{ label : '4', value : [4] },{ label : '1 or 4', value : [1,4] }];
      if(['2.7', '2.7.1', '2.8', '2.8.1', '2.8.2'].includes(version))                    return [ { label : 'Select Location', value : null},{ label : '1', value : [1] },{ label : '4', value : [4] },{ label : '1 or 4', value : [1,4] },{ label : '1 or 4 or 10', value : [1,4,10] }];
    }
    return null;

  }
}
