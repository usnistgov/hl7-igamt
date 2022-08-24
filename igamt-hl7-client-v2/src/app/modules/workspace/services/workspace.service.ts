import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Message } from '../../dam-framework/models/messages/message.class';
import { LoadPayloadData, LoadResourcesInRepostory } from '../../dam-framework/store';
import { IFolderContent, IFolderInfo, IWorkspaceInfo, IWorkspaceMetadata, WorkspaceAccessType } from '../models/models';

export interface IWorkspaceCreateRequest {
  accessType: WorkspaceAccessType;
  title: string;
  description: string;
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

}
