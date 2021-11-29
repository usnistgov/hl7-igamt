import { TreeNode } from 'primeng/api';
import { Type } from '../constants/type.enum';
import { IDeltaInfo, IDeltaNode } from './delta';
import { IDomainInfo } from './domain-info.interface';

export interface IValuesetDelta {
  type: Type;
  source: IDeltaInfo;
  target: IDeltaInfo;
  delta: IValuesetDeltaData;
}

export interface IValuesetDeltaData {
  action?: any;
  bindingIdentifier: IDeltaNode<string>;
  oid: string;
  intensionalComment: string;
  url: IDeltaNode<string>;
  stability: IDeltaNode<string>;
  extensibility: IDeltaNode<string>;
  contentDefinition: IDeltaNode<string>;
  sourceType: string;
  // TODO change type
  codeSystems: any;
  codes: ICodeDelta[];
}

export interface ICodeDelta extends TreeNode {
  action?: any;
  usage: IDeltaNode<string>;
  value: IDeltaNode<string>;
  description: IDeltaNode<string>;
  codeSystem: IDeltaNode<string>;
  codeSystemOid: IDeltaNode<string>;
  comments: IDeltaNode<string>;
}
