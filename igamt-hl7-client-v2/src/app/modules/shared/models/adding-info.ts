import {Type} from '../constants/type.enum';
import {IDomainInfo} from './domain-info.interface';

export interface IAddingInfo {
  originalId: string;
  id: string;
  name: string;
  structId?: string;
  description?: string;
  type: Type;
  domainInfo?: IDomainInfo;
  ext?: string;
  flavor?: boolean;
}
