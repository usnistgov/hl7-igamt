import { IAbstractDomain } from '../../../shared/models/abstract-domain.interface';
import { IContent } from '../../../shared/models/content.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IDomainInfo } from '../../../shared/models/domain-info.interface';
import { IMetadata } from '../../../shared/models/metadata.interface';
import { IRegistry } from '../../../shared/models/registry.interface';

export interface IgDocument extends IAbstractDomain {
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
