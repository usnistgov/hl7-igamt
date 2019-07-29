import {Type} from '../constants/type.enum';
import {IDomainInfo} from './domain-info.interface';
export enum SourceType {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
}
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
  sourceType?: SourceType;
  numberOfChildren?: number;
  includeChildren?: boolean;
  url?: string;
}
