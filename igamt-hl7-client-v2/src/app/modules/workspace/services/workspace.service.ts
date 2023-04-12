import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Message } from '../../dam-framework/models/messages/message.class';
import { LoadPayloadData, LoadResourcesInRepostory } from '../../dam-framework/store';
import { IgTemplate } from '../../shared/components/derive-dialog/derive-dialog.component';
import { IFolderContent, IFolderInfo, IWorkspaceInfo, IWorkspaceMetadata, IWorkspacePermissions, IWorkspaceUser } from '../models/models';
import { CloneModeEnum } from './../../shared/constants/clone-mode.enum';
import { Type } from './../../shared/constants/type.enum';

export interface IWorkspaceCreateRequest {
  title: string;
  description: string;
}

export interface IWorkspaceClone {
  documentId: string;
  documentType: Type;
  workspaceId: string;
  folderId: string;
  name: string;
  copyInfo: {
    inherit?: boolean,
    mode: CloneModeEnum,
    template?: IgTemplate,
  };
}

export interface IWorkspaceMove {
  documentId: string;
  documentType: Type;
  workspaceId: string;
  sourceFolderId: string;
  folderId: string;
  title: string;
  clone: boolean;
}

export interface IWorkspacePublish {
  documentId: string;
  documentType: Type;
  workspaceId: string;
  folderId: string;
  info: any;
}

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {

  readonly WORKSPACE_END_POINT = '/api/workspace/';

  constructor(
    private http: HttpClient,
    private store: Store<any>,
  ) {
  }

  createWorkspace(wrapper: IWorkspaceCreateRequest): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.WORKSPACE_END_POINT + 'create/', wrapper);
  }

  saveHomePageContent(id: string, content: { value: string }): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.WORKSPACE_END_POINT + id + '/home', content);
  }

  saveMetadata(id: string, content: IWorkspaceMetadata): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.WORKSPACE_END_POINT + id + '/metadata', content);
  }

  getWorkspaceInfo(id: string): Observable<IWorkspaceInfo> {
    return this.http.get<IWorkspaceInfo>(this.WORKSPACE_END_POINT + id + '/state');
  }

  getWorkspaceFolderContent(workspaceId: string, folderId: string): Observable<IFolderContent> {
    return this.http.get<IFolderContent>(this.WORKSPACE_END_POINT + workspaceId + '/folder/' + folderId);
  }

  addFolder(workspaceId: string, folder: { title: string, description: string }): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.WORKSPACE_END_POINT + workspaceId + '/add-folder', folder);
  }

  updateFolder(workspaceId: string, folderId: string, folder: { title: string, description: string }): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.WORKSPACE_END_POINT + workspaceId + '/folder/' + folderId, folder);
  }

  deleteFolder(folder: IFolderInfo): Observable<Message<string>> {
    return this.http.delete<Message<string>>(this.WORKSPACE_END_POINT + folder.workspaceId + '/folder/' + folder.id);
  }

  delete(id: string): Observable<Message<string>> {
    return this.http.delete<Message<string>>(this.WORKSPACE_END_POINT + id);
  }

  getWorkspaceUsers(id: string): Observable<IWorkspaceUser[]> {
    return this.http.get<IWorkspaceUser[]>(this.WORKSPACE_END_POINT + id + '/users');
  }

  addWorkspaceUser(id: string, isEmail: boolean, user: string, permissions: IWorkspacePermissions): Observable<Message<IWorkspaceUser>> {
    return this.http.post<Message<IWorkspaceUser>>(this.WORKSPACE_END_POINT + id + '/users/add', {
      email: isEmail,
      value: user,
      permissions,
    });
  }

  makeOwner(id: string, username: string): Observable<Message<IWorkspaceUser>> {
    return this.http.post<Message<IWorkspaceUser>>(this.WORKSPACE_END_POINT + id + '/users/change-owner', {
      username,
    });
  }

  acceptWorkspaceInvitation(id: string): Observable<Message<IWorkspaceUser>> {
    return this.http.post<Message<IWorkspaceUser>>(this.WORKSPACE_END_POINT + id + '/users/accept', {});
  }

  declineWorkspaceInvitation(id: string): Observable<Message<IWorkspaceUser>> {
    return this.http.post<Message<IWorkspaceUser>>(this.WORKSPACE_END_POINT + id + '/users/decline', {});
  }

  updateUser(id: string, username: string, permissions: IWorkspacePermissions): Observable<Message<IWorkspaceUser>> {
    return this.http.post<Message<IWorkspaceUser>>(this.WORKSPACE_END_POINT + id + '/users/update', {
      username,
      permissions,
    });
  }

  removeUser(id: string, username: string): Observable<Message<IWorkspaceUser>> {
    return this.http.post<Message<IWorkspaceUser>>(this.WORKSPACE_END_POINT + id + '/users/delete', {
      username,
    });
  }

  getWorkspaceInfoUpdateAction(workspaceInfo: IWorkspaceInfo): Action[] {
    return [
      new LoadPayloadData(workspaceInfo),
      new LoadResourcesInRepostory({
        collections: [{
          key: 'folders',
          values: workspaceInfo.folders,
        }],
      }),
    ];
  }

  cloneToWorkspace(info: IWorkspaceClone): Observable<IWorkspaceInfo> {
    return this.http.post<IWorkspaceInfo>(this.WORKSPACE_END_POINT + '/clone', info);
  }

  moveIg(info: IWorkspaceMove): Observable<IWorkspaceInfo> {
    return this.http.post<IWorkspaceInfo>(this.WORKSPACE_END_POINT + '/move', info);
  }

  publishIg(info: IWorkspacePublish): Observable<IWorkspaceInfo> {
    return this.http.post<IWorkspaceInfo>(this.WORKSPACE_END_POINT + '/publish', info);
  }

  deleteFromWorkspace(documentId: string, documentType: Type, wsId: string, folderId: string): Observable<IWorkspaceInfo> {
    return this.http.delete<IWorkspaceInfo>(this.WORKSPACE_END_POINT + `/${wsId}/folder/${folderId}/document/${documentType}/${documentId}`);
  }

}
