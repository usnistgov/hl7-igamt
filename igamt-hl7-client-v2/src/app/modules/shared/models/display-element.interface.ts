import {Type} from '../constants/type.enum';
import {IDomainInfo} from './domain-info.interface';

export interface IDisplayElement {
  id: string;
  fixedName: string;
  variableName: string;
  description: string;
  domainInfo?: IDomainInfo;
  type: Type;
  leaf: boolean;
  position?: number;
  differential: boolean;
  children?: IDisplayElement[];
  isExpanded: boolean;
  path?: string;
}
