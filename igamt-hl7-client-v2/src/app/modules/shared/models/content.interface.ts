import {Type} from '../constants/type.enum';

export interface IContent {
  id: string;
  description?: any;
  type: Type;
  position: number;
  label: string;
  children: IContent[];
}
