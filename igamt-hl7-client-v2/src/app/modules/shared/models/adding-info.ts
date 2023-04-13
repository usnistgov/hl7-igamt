import {Type} from '../constants/type.enum';
import { ProfileType, Role } from './conformance-profile.interface';
import {IDomainInfo} from './domain-info.interface';
export enum SourceType {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
}

export interface ISubstitution {
  create: boolean;
  ext: string;
  type: Type;
  originalId: string;
  newId: string;
}

export interface IAddingInfo {
  originalId: string;
  id: string;
  name: string;
  fixedExt?: string;
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
  oid?: string;
  substitutes?: ISubstitution[];
  role?: Role;
  profileType?: ProfileType;
}
