import { IBindingLocationItem } from '../components/binding-selector/binding-selector.component';
import { IUsageOption } from '../components/hl7-v2-tree/columns/usage/usage.component';
import { Type } from '../constants/type.enum';
import { Usage } from '../constants/usage.enum';

export interface IConnectingInfo {
  label: string;
  url: string;
  redirectToken: string;
  loginUrl: string;
  createDomainInput: string;
  position: number;
}

export class IBindingLocationInfoConfig {
  type: Type;
  name: string;
  location: number;
  version?: string[];
}

export interface IAllowedBindingLocationsMap {
  [k: string]: IBindingLocationItem[];
}

export interface IValueSetBindingConfigMap {
  [k: string]: IBindingInfo;
}

export interface IBindingInfo {
  multiple: boolean;
  allowValueSet?: boolean;
  coded: boolean;
  complex: boolean;
  allowSingleCode: boolean;
  locationIndifferent: boolean;
  locationExceptions: IBindingLocationInfoConfig[];
  allowedBindingLocations: IAllowedBindingLocationsMap;
}
export class Hl7Config {
  constructor(readonly hl7Versions?: string[], readonly usages?: string[], readonly phinvadsUrl?: string, readonly connection?: IConnectingInfo[], readonly valueSetBindingConfig?: IValueSetBindingConfigMap, readonly froalaConfig?: any) {
  }

  static getUsageOptions(usages: string[], includeW: boolean, includeB: boolean): IUsageOption[] {
    return usages.map((u) => {
      return {
        label: u === 'CAB' ? 'C (A/B)' : u,
        value: u as Usage,
      };
    }).filter((elm) => {
      if (elm.value === Usage.W && includeW) {
        return true;
      }

      if (elm.value === Usage.B && includeB) {
        return true;
      }

      if (elm.value === Usage.W || elm.value === Usage.B) {
        return false;
      }

      return true;
    });
  }
}
