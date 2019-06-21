import {IContent} from '../../../shared/models/content.interface';
import {IDisplayElement} from '../../../shared/models/display-element.interface';
import {IDomainInfo} from '../../../shared/models/domain-info.interface';
import {IMetadata} from '../../../shared/models/metadata.interface';
import {IRegistry} from '../../../shared/models/registry.interface';

export interface IgDocument {
  id: string;
  name?: any;
  publicationInfo?: any;
  domainInfo: IDomainInfo;
  username: string;
  comment?: any;
  description?: any;
  createdFrom?: any;
  authorNotes?: any;
  usageNotes?: any;
  origin?: any;
  creationDate: string;
  updateDate: string;
  from: string;
  version: number;
  metadata: IMetadata;
  content: IContent[];
  datatypeRegistry: IRegistry;
  segmentRegistry: IRegistry;
  profileComponentRegistry: IRegistry;
  compositeProfileRegistry: IRegistry;
  conformanceProfileRegistry: IRegistry;
  valueSetRegistry: IRegistry;
  label?: any;
}

export interface IGDisplayInfo {
  ig: IgDocument;
  segments?: IDisplayElement[];
  valueSets?: IDisplayElement[];
  datatypes?: IDisplayElement[];
  messages?: IDisplayElement[];
}
