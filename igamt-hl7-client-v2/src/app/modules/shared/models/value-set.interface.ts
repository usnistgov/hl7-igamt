import {ContentDefinition} from '../constants/content-definition.enum';
import {Extensibility} from '../constants/extensibility.enum';
import {Stability} from '../constants/stability.enum';
import {CodeUsage} from '../constants/usage.enum';
import {SourceType} from './adding-info';
import {IResource} from './resource.interface';

export interface ICodes {
  value: string;
  id: string;
  description: string;
  codeSystem: string;
  usage: CodeUsage;
  comments: string;
}

export interface IValueSet extends IResource {
  codes: ICodes[];
  codeSystems?: string[];
  includeCodes?: boolean;
  url?: string;
  sourceType: SourceType;
  numberOfCodes: number;
  bindingIdentifier: string;
  stability: Stability;
  extensibility: Extensibility;
  contentDefinition: ContentDefinition;
  intensionalComment?: string;
  oid?: string;
}
