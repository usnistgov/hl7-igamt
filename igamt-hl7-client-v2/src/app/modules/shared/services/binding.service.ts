import { Injectable } from '@angular/core';
import {IBindingLocationInfo, IBindingLocationItem} from '../components/binding-selector/binding-selector.component';
import {Type} from '../constants/type.enum';
import {IBindingInfo, IBindingLocationInfoConfig, IValueSetBindingConfigMap} from '../models/config.class';

function contains(locationExceptions: IBindingLocationInfoConfig[], version: string, location: number, type: Type, elementName: string) {
  return locationExceptions.filter((x: IBindingLocationInfoConfig) => {
    return elementName === x.name && type === x.type && location === x.location && x.version.includes(version);
   }).length > 0;
}

@Injectable({
  providedIn: 'root',
})
export class BindingService {

  getBingdingInfo(version: string, elementName: string, location: number, type: Type, valueSetBindingConfig: IValueSetBindingConfigMap): IBindingLocationInfo {
    const ret: IBindingLocationInfo = {
      allowedBindingLocations: [],
      singleCodeAllowed: false,
      multiple: false,
      coded: false,
      allowSingleCode: false,
      allowValueSets: false,
    };
    console.log(valueSetBindingConfig[elementName]);
    if (valueSetBindingConfig[elementName]) {
      const config = valueSetBindingConfig[elementName];
      if (config.locationIndifferent || contains(config.locationExceptions, version, location, type, elementName)) {
          ret.multiple = config.multiple;
          ret.allowValueSets = true;
          ret.singleCodeAllowed = config.allowSingleCode;
          ret.coded = config.allowSingleCode;
          if (config.allowedBindingLocations) {
            const versionKey = version.replace(/\./g, '-');
            if (config.allowedBindingLocations[versionKey]) {
              ret.allowedBindingLocations = config.allowedBindingLocations[versionKey];
            }
          }
        }
    }
    return ret;
  }

  constructor() { }
}
