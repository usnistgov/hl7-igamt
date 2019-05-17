import {Scope} from '../constants/scope.enum';
import {Type} from '../constants/type.enum';

export interface IResourceInfo {
  type?: Type;
  scope?: Scope;
  version?: string;
}
