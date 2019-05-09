import {Type} from '../constants/type.enum';
import {IResource} from './resource.interface';

export interface IRegistry {
  children: IResource[];
  type: Type;
}
