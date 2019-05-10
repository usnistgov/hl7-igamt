import {Scope} from '../../../shared/constants/scope.enum';
import {Type} from '../../../shared/constants/type.enum';
import {IDisplayElement} from '../../../shared/models/display-element.interface';

export interface IAddWrapper {
  node?: IDisplayElement;
  type?: Type;
  scope?: Scope;
}
