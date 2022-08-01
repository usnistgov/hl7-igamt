import { Action } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Message } from './../../dam-framework/models/messages/message.class';
import { Observable } from 'rxjs';
import { IWorkspace, IWorkspaceDisplayInfo } from './../models/models';
import { Injectable } from '@angular/core';
import * as fromDam from 'src/app/modules/dam-framework/store/index';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  readonly WORKSPACE_END_POINT = '/api/workspaces/';

  constructor(private http: HttpClient) {
  }

  createWorkspace(wrapper: IWorkspace): Observable<IWorkspace> {
    return this.http.post<IWorkspace>(this.WORKSPACE_END_POINT+ 'create/', wrapper);
  }

  loadRepositoryFromWorkspaceDisplayInfo(workspaceInfo: IWorkspaceDisplayInfo, values?: string[]): any {
    return this.loadOrInsertRepositoryFromWorkspaceDisplayInfo(workspaceInfo, true, values);

  }
  getWorkspaceInfo(id: string): Observable<IWorkspaceDisplayInfo> {

    return this.http.get<IWorkspaceDisplayInfo>(this.WORKSPACE_END_POINT + id + '/state');

  }

  loadOrInsertRepositoryFromWorkspaceDisplayInfo(workspaceInfo: IWorkspaceDisplayInfo, load: boolean, values?: string[]): fromDam.InsertResourcesInRepostory | fromDam.LoadResourcesInRepostory {
    const _default = ['igs'];
    console.log('loading');
    const collections = (values ? values : _default).map((key) => {
      return {
        key,
        values: workspaceInfo[key],
      };
    });
    return !load ? new fromDam.InsertResourcesInRepostory({
      collections,
    }) : new fromDam.LoadResourcesInRepostory({
      collections,
    });
  }


  insertRepositoryFromWorkspaceDisplayInfo(igInfo: IWorkspaceDisplayInfo, values?: string[]): Action {
    return this.loadOrInsertRepositoryFromWorkspaceDisplayInfo(igInfo, false, values);
  }



}

