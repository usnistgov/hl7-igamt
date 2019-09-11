import { IBindingLocationItem } from '../components/binding-selector/binding-selector.component';
import { Type } from '../constants/type.enum';

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
  constructor(readonly hl7Versions?: string[], readonly usages?: string[], readonly phinvadsUrl?: string, readonly connection?: IConnectingInfo[], readonly valueSetBindingConfig?: IValueSetBindingConfigMap) {
  }
}
