import { IEditorMetadata } from "../../dam-framework";
import { ICodes } from "../../shared/models/value-set.interface";

export interface  ICodeSetInfo {
  id?: string;
  metadata: ICodeSetInfoMetadata;
  children?: ICodeSetVersionInfo[];
}

export interface  ICodeSetInfoMetadata {
 title?: string;
 description? : string;
}

export interface  ICodeSetVersionInfo {
  id: string;
  type: "CODESETVERSION";
  version: string;
  exposed: boolean;
  date: string;
  comment: string;
  parentId: string;
}

export interface ICodeSetActive {
  display: any;
  editor: IEditorMetadata;
}


export interface ICodeSetVersionContent extends ICodeSetVersionInfo {
  codes: ICodes[];
}
