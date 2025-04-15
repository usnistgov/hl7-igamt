import { IAbstractDomain } from '../../../shared/models/abstract-domain.interface';
import { IContent } from '../../../shared/models/content.interface';
import { IMetadata } from '../../../shared/models/metadata.interface';
import { IRegistry } from '../../../shared/models/registry.interface';

export interface IDocument extends IAbstractDomain {
  metadata: IMetadata;
  content: IContent[];
  draft?: boolean;
  deprecated?: boolean;
  documentConfig?: IDocumentConfig;
  valueSetGroups?: any;

}

export interface IDocumentConfig {
  includeIX?: true;
}
