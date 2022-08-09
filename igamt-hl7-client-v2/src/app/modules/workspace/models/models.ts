import { Type } from '../../shared/constants/type.enum';

export enum WorkspaceAccessType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export enum WorkspacePermissionType {
  VIEW = 'VIEW',
  EDIT = 'EDIT',
}
export interface IWorkspaceInfo {
  id: string;
  admin: boolean;
  accessType: WorkspaceAccessType;
  metadata: IWorkspaceMetadata;
  homePageContent: string;
  owner: string;
  folders: IFolderInfo[];
  created: Date;
  updated: Date;
}

export interface IWorkspaceMetadata {
  title: string;
  description?: string;
  logoImageId?: string;
}
export interface IDocumentLinks {
  id: string;
  type: Type;
  position: number;
}
export interface IFolderInfo {
  id: string;
  type: 'FOLDER';
  metadata: IFolderMetadata;
  children: IDocumentLinks[];
  position: number;
  permissionType: WorkspacePermissionType;
  editors: string[];
}

export interface IFolderMetadata {
  title: string;
  description?: string;
}
