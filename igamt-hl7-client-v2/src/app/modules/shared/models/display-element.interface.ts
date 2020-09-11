import {Type} from '../constants/type.enum';
import {IActiveInfo, Status} from './abstract-domain.interface';
import { SourceType } from './adding-info';
import {DeltaAction} from './delta';
import {IDomainInfo} from './domain-info.interface';
import {IPublicationInfo} from './publication-info.interface';

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
  parentType?: Type;
  parentId?: string;
  libraryReferences?: string[];
  isExpanded: boolean;
  path?: string;
  delta?: DeltaAction;
  flavor?: boolean;
  status?: Status;
  origin?: string;
  publicationInfo?: IPublicationInfo;
  activeInfo?: IActiveInfo;

}
