import { ICodeSetReference } from '../../code-set-editor/models/code-set.models';
import {ContentDefinition} from '../constants/content-definition.enum';
import {Extensibility} from '../constants/extensibility.enum';
import {Stability} from '../constants/stability.enum';
import {CodeUsage} from '../constants/usage.enum';
import {SourceType} from './adding-info';
import {IResource} from './resource.interface';
import {IChangeReason} from './save-change';

export interface ICodes {
  value: string;
  id: string;
  description: string;
  codeSystem: string;
  hasPattern?: boolean;
  usage?: CodeUsage;
  pattern: string;
  codeSystemOid?: string;
  comments: string;
}

export interface IValueSet extends IResource {
  codeSetReference?: ICodeSetReference;
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
  changeLogs?: any[];
  codeSetLink?: ILinkedCodeSetInfo;

}
export interface ILinkedCodeSetInfo {
  version?: string;
  parentName?: string;
  commitDate?: string ;
  latest?: boolean;
  latestFetched?: string;
}
