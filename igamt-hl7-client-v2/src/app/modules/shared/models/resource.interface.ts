import {IDomainInfo} from './domain-info.interface';

export interface IResource {
  id: string;
  position: number;
  domainInfo: IDomainInfo;
  type?: any;
}
