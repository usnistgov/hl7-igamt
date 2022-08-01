import { IgListItem } from './../../document/models/document/ig-list-item.class';
import { IDocumentRef } from './../../shared/models/abstract-domain.interface';
import { Type } from "../../shared/constants/type.enum";

export enum WorkspaceAccessType {
  PUBLIC = 'PUBLIC',
  DISCOVERABLE = 'DISCOVERABLE',
  PRIVATE = 'PRIVATE'
}

export interface IWorkspace {
  id: string,
  accessType?: WorkspaceAccessType,
  metadata: IWorkspaceMetadata,
  userAccessInfo?: IUserAccessInfo,
  documents: IDocumentLinks[],
  folders: IFolder[]
}

export interface IWorkspaceMetadata {
  title: string,
  description?: string,
  coverPicture?: string,
}
export interface IDocumentLinks {
  id: string,
  type: Type,
  position: number,
}
export interface IFolder {
  metadata : IWorkspaceMetadata,
  userAccessInfo?: IUserAccessInfo,
  documents: IDocumentLinks[],
  position: number,
}
export interface IUserAccessInfo {
  owner?: string,
}

export interface IWorkspaceDisplayInfo {
  igs?: IgListItem[]
  workspace?: IWorkspace,
}
