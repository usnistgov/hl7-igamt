import {Scope} from '../constants/scope.enum';

export interface IDomainInfo {
  version: string;
  compatibilityVersion?: any[];
  scope: Scope;
}
