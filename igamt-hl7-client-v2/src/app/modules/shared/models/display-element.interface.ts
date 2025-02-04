import { ResourceOrigin } from '../constants/resource-origin.enum';
import { Type } from '../constants/type.enum';
import { IActiveInfo, Status } from './abstract-domain.interface';
import { DeltaAction } from './delta';
import { IDomainInfo } from './domain-info.interface';
import { IPublicationInfo } from './publication-info.interface';

export interface IDisplayElement {
  id: string;
  fixedName: string;
  variableName: string;
  description: string;
  domainInfo?: IDomainInfo;
  type: Type;
  leaf: boolean;
  position?: number;
  differential?: boolean; // delta could be calculated
  derived?: boolean;
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
  flavorExt?: string;
  resourceName?: string;
  structureIdentifier?: string;
  resourceOrigin?: ResourceOrigin;
  generated?: boolean;
}

export interface ISummaryElement {
  id?: string;

}
