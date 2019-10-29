import {Type} from '../constants/type.enum';
import {DeltaAction} from './delta';

export interface IContent {
  id: string;
  description?: any;
  type: Type;
  position: number;
  label: string;
  delta?: DeltaAction;
  children: IContent[];
}
