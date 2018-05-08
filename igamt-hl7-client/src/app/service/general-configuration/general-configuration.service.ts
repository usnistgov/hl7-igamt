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

  constructor(){

    //TODO GETTING USAGES FROM API
    this._usages = [ { label : 'R', value : 'R' },{ label : 'RE', value : 'RE' },{ label : 'C', value : 'C' }, { label : 'X', value : 'O' }];
    this._valueSetAllowedDTs = ["ID", "IS", "CE", "CF", "CWE", "CNE", "CSU","HD"];
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

}
