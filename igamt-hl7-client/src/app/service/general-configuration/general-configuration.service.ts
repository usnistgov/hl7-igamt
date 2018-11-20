/**
 * Created by hnt5 on 11/2/17.
 */
import {Injectable} from '@angular/core';
import { _ } from 'underscore';

@Injectable()
export class GeneralConfigurationService {

  //TODO ADDING OTHER CONFIG DATA
  _usages: any;

  _cUsages: any;

  _valueSetAllowedDTs: any;

  _valueSetAllowedComponents: any;

  _singleValueSetDTs: any;

  _valueSetAllowedFields: any;

  _valuesetStrengthOptions: any;

  _codedElementDTs: any;

  _simpleConstraintVerbs: any[];

  _propsotionVerbs: any[];

  _occurenceTypes: any[];

  _declarativeTypes:any[];

  _propsotionTypes: any[];

  _declarativeCTypes:any[];

  _ifConstraintVerbs: any[];

  _instanceNums: any[];

  _operators: any[];

  _formatTypes: any[];

  _simpleAssertionTypes: any[];

  _assertionModes: any[];

  _constraintTypes: any[];

  _extensibilityOptions:any[];

  _stabilityOptions:any[];

  _contentDefinitionOptions:any[];

  _codeUsageOptions:any[];

  constructor(){

    this._constraintTypes = [
      {label: 'SIMPLE', value: 'simple', icon: 'fa fa-fw fa-file-code-o'},
      {label: 'SIMPLE + Proposition Patterns', value: 'simple-proposition', icon: 'fa fa-fw fa-file-code-o'},
      {label: 'COMPLEX', value: 'complex', icon: 'fa fa-fw fa-file-code-o'},
      {label: 'Free', value: 'free', icon: 'fa fa-fw fa-file-text-o'}
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

    this._instanceNums = [
      { label : 'Select #', value : null },
      { label : 'ONE', value : '*' },
      { label : 'the first', value : '1' },
      { label : 'the second', value : '2' },
      { label : 'the third', value : '3' },
      { label : 'the forth', value : '4' },
      { label : 'the fifth', value : '5' },
      { label : 'the sixth', value : '6' },
      { label : 'the seventh', value : '7' },
      { label : 'the eighth', value : '8' },
      { label : 'the ninth', value : '9' },
      { label : 'the tenth', value : '10' }
    ];



    this._assertionModes = [
      {
        label: 'Simple Assertion',
        items: [
          {label: 'Single', value: 'SIMPLE'}
        ]
      },
      {
        label: 'Complex Assertion',
        items: [
          {label: 'IFTHEN', value: 'IFTHEN'},
          {label: 'AND/OR', value: 'ANDOR'},
          {label: 'NOT', value: 'NOT'}
        ]
      }
    ];

    this._codeUsageOptions = [ { label : 'Required', value : 'R' },{ label : 'Permitted', value : 'P' },{ label : 'Excluded', value : 'E' }];
    this._simpleConstraintVerbs = [ { label : 'SHALL', value : 'SHALL' },{ label : 'SHALL NOT', value : 'SHALL NOT' },{ label : 'SHOULD', value : 'SHOULD' },{ label : 'SHOULD NOT', value : 'SHOULD NOT' },{ label : 'MAY', value : 'MAY' },{ label : 'MAY NOT', value : 'MAY NOT' }];
    this._propsotionVerbs =  [ { label : 'IS', value : 'IS' },{ label : 'IS NOT', value : 'IS NOT' },{ label : 'DO', value : 'DO' },{ label : 'DO NOT', value : 'DO NOT' }];
    this._occurenceTypes = [ { label : 'At least one occurrence of', value : 'atLeast' },{ label : "The 'INSTANCE' occurrence of", value : 'instance' },{ label : 'No occurrence of', value : 'noOccurrence' },{ label : 'Exactly one occurrence of', value : 'exactlyOne' },{ label : "'COUNT' occurrences of", value : 'count' },{ label : 'All occurrences of', value : 'all' }];

    this._propsotionTypes = [
      { label : "valued.", value : 'valued' },
      { label : "contain the value 'VALUE'.", value : 'containtValue' },
      { label : "contain one of the values in the list: { 'VALUE 1', 'VALUE 2', 'VALUE N' }.", value : 'containListValues' }
    ];

    this._declarativeTypes = [
      { label : "contain the value 'VALUE'.", value : 'containtValue' },
      { label : "contain the value 'VALUE' (DESCRIPTION).", value : 'containValueDesc' },
      { label : "contain the value 'VALUE' drawn from the code system 'CODE SYSTEM'.", value : 'containCode' },
      { label : "contain one of the values in the list: { 'VALUE 1', 'VALUE 2', 'VALUE N' }.", value : 'containListValues' },
      { label : "contain one of the values in the list: { 'VALUE 1', 'VALUE 2', 'VALUE N' } drawn from the code system 'CODE SYSTEM'.", value : 'containListCodes' },
      { label : "match the regular expression 'REGULAR EXPRESSION'.", value : 'regex' },
      { label : "contain a positive integer'.", value : 'positiveInteger' },
      { label : "be valued sequentially starting with the value '1'.", value : 'sequentially' },
      { label : "be valued with an ISO-compliant OID.", value : 'iso' }
    ];

    this._declarativeCTypes = [
      { label : "be identical to", value : 'c-identical' },
      { label : "be earlier than", value : 'c-earlier' },
      { label : "be earlier than or equivalent to", value : 'c-earlier-equivalent' },
      { label : "be truncated earlier than", value : 'c-truncated-earlier' },
      { label : "be truncated earlier than or truncated equivalent to", value : 'c-truncated-earlier-equivalent' },
      { label : "be equivalent to", value : 'c-equivalent' },
      { label : "be truncated equivalent to", value : 'c-truncated-equivalent' },
      { label : "be equivalent to or later than", value : 'c-equivalent-later' },
      { label : "be later than", value : 'c-later' },
      { label : "be truncated equivalent to or truncated later than", value : 'c-truncated-equivalent-later' },
      { label : "be truncated later than", value : 'c-truncated-later' }
    ];
    this._ifConstraintVerbs = [ { label : 'is', value : 'IS' },{ label : 'is NOT', value : 'is NOT' }];
    this._formatTypes = [ { label : 'be ISO format', value : 'iso' },{ label : 'be positive', value : 'positive' },{ label : 'be negative', value : 'negative' },{ label : 'be numeric', value : 'numeric' },{ label : 'be alphanumeric', value : 'alphanumeric' },{ label : 'be regrex', value : 'regrex' }];
    this._operators = [ { label : 'be identical to the content of', value : 'equal' },{ label : 'be greater to the value of', value : 'greater' },{ label : 'be less to the value of', value : 'less' },{ label : 'be same or greater to the value of', value : 'equalorgreater' },{ label : 'be same or less to the value of', value : 'equalorless' },{ label : 'be different to the value of', value : 'notequal' }];
    this._usages = [ { label : 'R', value : 'R' },{ label : 'RE', value : 'RE' },{ label : 'C', value : 'C' }, { label : 'O', value : 'O' }, { label : 'X', value : 'X' }];
    this._extensibilityOptions = [ { label : 'Open', value : 'Open' },{ label : 'Closed', value : 'Closed' },{ label : 'Undefined', value : 'Undefined' }];
    this._stabilityOptions = [ { label : 'Static', value : 'Static' },{ label : 'Dynamic', value : 'Dynamic' },{ label : 'Undefined', value : 'Undefined' }];
    this._contentDefinitionOptions = [ { label : 'Extensional', value : 'Extensional' },{ label : 'Intensional', value : 'Intensional' },{ label : 'Undefined', value : 'Undefined' }];
    this._cUsages = [ {label : '', value : null}, { label : 'R', value : 'R' },{ label : 'RE', value : 'RE' }, { label : 'O', value : 'O' }, { label : 'X', value : 'X' }];
    this._valuesetStrengthOptions = [ { label : 'Select Strength', value : null},{ label : 'R', value : 'R' },{ label : 'S', value : 'S' },{ label : 'U', value : 'U' }];
    this._valueSetAllowedDTs = ["ID", "IS", "CE", "CF", "CWE", "CNE", "CSU","HD"];
    this._codedElementDTs = ["CE", "CF", "CWE", "CNE", "CSU"];
    this._singleValueSetDTs = ["ID", "IS", "ST", "NM", "HD"];
    this._valueSetAllowedFields =[
        {
          'segmentName': 'PID',
          'location': 23,
          'type': 'FIELD'
        }
    ];
    this._valueSetAllowedComponents =
    [
      {
        'dtName': 'CNS',
        'location': 7
      },
      {
        'dtName': 'CSU',
        'location': 11
      },
      {
        'dtName': 'XON',
        'location': 10
      },
      {
        'dtName': 'CSU',
        'location': 2
      },
      {
        'dtName': 'LA2',
        'location': 12
      },
      {
        'dtName': 'OSD',
        'location': 4
      },
      {
        'dtName': 'AD',
        'location': 4
      },
      {
        'dtName': 'LA2',
        'location': 11
      },
      {
        'dtName': 'XAD',
        'location': 4
      },
      {
        'dtName': 'AD',
        'location': 5
      },
      {
        'dtName': 'XAD',
        'location': 3
      },
      {
        'dtName': 'XON',
        'location': 3
      },
      {
        'dtName': 'AD',
        'location': 3
      },
      {
        'dtName': 'CSU',
        'location': 14
      },
      {
        'dtName': 'LA2',
        'location': 13
      },
      {
        'dtName': 'OSD',
        'location': 2
      },
      {
        'dtName': 'XAD',
        'location': 5
      },
      {
        'dtName': 'CSU',
        'location': 5
      }
    ];
  }

  get usages(){
    return this._usages;
  }

  getInstancLabelByValue(val){
    if(val === '*') return 'ONE';
    if(val === '1') return 'the first';
    if(val === '2') return 'the second';
    if(val === '3') return 'the third';
    if(val === '4') return 'the forth';
    if(val === '5') return 'the fifth';
    if(val === '6') return 'the sixth';
    if(val === '7') return 'the seventh';
    if(val === '8') return 'the eighth';
    if(val === '9') return 'the ninth';
    if(val === '10') return 'the tenth';

    return null;
  }


  get valueSetAllowedDTs(){
    return this._valueSetAllowedDTs;
  }

  get valueSetAllowedComponents(){
    return this._valueSetAllowedComponents;
  }

  isValueSetAllow(dtName, position, parrentNode, SegmentName, type){
    if (this._valueSetAllowedDTs.includes(dtName)) return true;
    if (SegmentName && this._valueSetAllowedFields.includes({
        'segmentName': SegmentName,
        'location': position,
        'type': type
    })) return true;

    if (parrentNode && parrentNode.data.segmentLabel && this._valueSetAllowedFields.includes({
          'segmentName': parrentNode.data.segmentLabel.name,
          'location': position,
          'type': type
        })) return true;

    if (parrentNode && parrentNode.data.datatypeLabel && this._valueSetAllowedComponents.includes({
          'dtName': parrentNode.data.datatypeLabel.name,
          'location': position
    })) return true;
    return false;
  }

  isSingleCodeAllow(dtName, position, parrentNode, SegmentName, type, isLeaf, bindings){
    if(isLeaf){
      if(this.isValueSetAllow(dtName, position, parrentNode, SegmentName, type)){
        if(!this.hasValueSet(bindings)){
          return true;
        }
      }
    }
    return false;
  }

  isConstantValueAllow(dtName, position, parrentNode, SegmentName, type, isLeaf){
    if(isLeaf){
      if(!this.isValueSetAllow(dtName, position, parrentNode, SegmentName, type)){
        return true;
      }
    }
    return false;
  }

  hasValueSet(bindings){
    if(bindings){
      for(let b of bindings){
        if(b.valuesetBindings && b.valuesetBindings.length > 0) return true;
      }
    }
    return false;
  }

  isMultipleValuseSetAllowed(dtName){
    if (this._singleValueSetDTs.includes(dtName)) return false;
    return true;
  }

  getValuesetLocations(dtName, version){
    if (this._codedElementDTs.includes(dtName)){
      if (['2.1', '2.2', '2.3', '2.3.1', '2.4', '2.5', '2.5.1', '2.6'].includes(version)) return [ { label : 'Select Location', value : null}, { label : '1', value : [1] }, { label : '4', value : [4] }, { label : '1 or 4', value : [1, 4] }];
      if (['2.7', '2.7.1', '2.8', '2.8.1', '2.8.2'].includes(version))                    return [ { label : 'Select Location', value : null}, { label : '1', value : [1] }, { label : '4', value : [4] }, { label : '1 or 4', value : [1, 4] }, { label : '1 or 4 or 10', value : [1, 4, 10] }];
    }
    return null;
  }

  getAllValuesetLocations(){
    const c1 = [ { label : 'Select Location', value : null}, { label : '1', value : [1] }, { label : '4', value : [4] }, { label : '1 or 4', value : [1, 4] }];
    const c2 = [ { label : 'Select Location', value : null}, { label : '1', value : [1] }, { label : '4', value : [4] }, { label : '1 or 4', value : [1, 4] }, { label : '1 or 4 or 10', value : [1, 4, 10] }];
    return {
      '2.1' : c1,
      '2.2' : c1,
      '2.3' : c1,
      '2.3.1' : c1,
      '2.4' : c1,
      '2.5' : c1,
      '2.5.1' : c1,
      '2.6' : c1,
      '2.7' : c2,
      '2.7.1' : c2,
      '2.8' : c2,
      '2.8.1' : c2,
      '2.8.2' : c2
    };
  }

  getValuesetLocationsForCE(version){
    if (['2.1', '2.2', '2.3', '2.3.1', '2.4', '2.5', '2.5.1', '2.6'].includes(version)) return [ { label : 'Select Location', value : null}, { label : '1', value : [1] }, { label : '4', value : [4] }, { label : '1 or 4', value : [1, 4] }];
    if (['2.7', '2.7.1', '2.8', '2.8.1', '2.8.2'].includes(version))                    return [ { label : 'Select Location', value : null}, { label : '1', value : [1] }, { label : '4', value : [4] }, { label : '1 or 4', value : [1, 4] }, { label : '1 or 4 or 10', value : [1, 4, 10] }];
    return null;
  }


  isCodedElement(dtName) {
    return this._codedElementDTs.includes(dtName);
  }

  getOperatorLable(operator){
    if (operator){
      for (const entry of this._operators) {
        if (entry.value === operator) return entry.label;
      }
    }
    return null;
  }

  getFormattedType(type){
    if (type){
      for (const entry of this._formatTypes) {
        if (entry.value === type) return entry.label;
      }
    }
    return null;
  }

  arraySortByPosition(objectArray){
    objectArray = _.sortBy(objectArray, function(item){ return item.data.position});
    for(let child of objectArray){
      if(child.children){
        child.children = this.arraySortByPosition(child.children);
      }
    }
    return objectArray;
  }
}
