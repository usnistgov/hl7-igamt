import {Type} from '../constants/type.enum';
import {ILink} from './link.interface';

export interface IRegistry {
  children: ILink[];
  type: Type;
}
