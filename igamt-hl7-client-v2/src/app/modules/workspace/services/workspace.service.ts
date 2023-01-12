import { Type } from './../../shared/constants/type.enum';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Message } from '../../dam-framework/models/messages/message.class';
import { LoadPayloadData, LoadResourcesInRepostory } from '../../dam-framework/store';
import { IFolderContent, IFolderInfo, IWorkspaceInfo, IWorkspaceMetadata, IWorkspacePermissions, IWorkspaceUser } from '../models/models';

export interface IWorkspaceCreateRequest {
  title: string;
  description: string;
}

export interface IWorkspaceClone {
  documentId: string,
  documentType: Type,
  workspaceId: string,
  folderId: string,
  name: string,
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

  addFolder(id: string, folder: IFolderInfo): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.WORKSPACE_END_POINT + id + '/add-folder', folder);
  }

  updateFolder(id: string, folderId: string, folder: IFolderInfo): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.WORKSPACE_END_POINT + id + '/update-folder/' + folderId, folder);
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

}
