import {IDomainInfo} from './domain-info.interface';

export interface ILink {
  id: string;
  position: number;
  domainInfo: IDomainInfo;
  type?: any;
}
