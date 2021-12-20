import {IDocument} from '../../../document/models/document/IDocument.interface';
import { IAbstractDomain } from '../../../shared/models/abstract-domain.interface';
import { IContent } from '../../../shared/models/content.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IDomainInfo } from '../../../shared/models/domain-info.interface';
import { IMetadata } from '../../../shared/models/metadata.interface';
import { IRegistry } from '../../../shared/models/registry.interface';

export interface IgDocument extends IDocument {
  datatypeRegistry: IRegistry;
  segmentRegistry: IRegistry;
  profileComponentRegistry: IRegistry;
  compositeProfileRegistry: IRegistry;
  conformanceProfileRegistry: IRegistry;
  coConstraintGroupRegistry: IRegistry;
  valueSetRegistry: IRegistry;
  label?: any;
  derived: boolean;
}

export interface IDocumentDisplayInfo<T extends IDocument> {
  ig: T;
  segments?: IDisplayElement[];
  valueSets?: IDisplayElement[];
  datatypes?: IDisplayElement[];
  messages?: IDisplayElement[];
  profileComponents?: IDisplayElement[];
  compositeProfiles?: IDisplayElement[];
  coConstraintGroups?: IDisplayElement[];
  targetResourceId?: string;
}
