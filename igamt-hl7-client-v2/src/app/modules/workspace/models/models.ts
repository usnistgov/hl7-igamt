import { IgListItem } from '../../document/models/document/ig-list-item.class';
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
  workspaceId: string;
  type: 'FOLDER';
  metadata: IFolderMetadata;
  children: IDocumentLinks[];
  position: number;
  permissionType: WorkspacePermissionType;
  editors: string[];
}

export interface IFolderContent extends IFolderInfo {
  documents: IgListItem[];
}

export interface IFolderMetadata {
  title: string;
  description?: string;
}

export interface IWorkspaceUser {
  username: string;
  addedBy: string;
  joined: Date;
  added: Date;
  status: InvitationStatus;
  permissions: IWorkspacePermissions;
}

export enum InvitationStatus {
  PENDING = 'PENDING',
  DECLINED = 'DECLINED',
  ACCEPTED = 'ACCEPTED',
}

export interface IWorkspacePermissions {
  admin: boolean;
  global?: WorkspacePermissionType;
  byFolder?: Record<string, WorkspacePermissionType>;
}
