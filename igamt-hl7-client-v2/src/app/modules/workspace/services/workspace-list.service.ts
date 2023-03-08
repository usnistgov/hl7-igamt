import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Message } from '../../dam-framework/models/messages/message.class';
import { WorkspaceLoadType } from './../../../root-store/workspace/workspace-list/workspace-list.actions';
import { IWorkspaceListItem } from './../../shared/models/workspace-list-item.interface';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceListService {

  constructor(private http: HttpClient) {
  }

  // loadTypeToAPI(type: WorkspaceLoadType) {
  //   switch (type) {
  //     case 'PRIVATE':
  //       return 'PRIVATE';
  //     case 'PUBLIC':
  //       return 'PUBLIC';
  //     case 'DISCOERABLE':
  //       return 'DISCOERABLE';
  //     case 'ALL':
  //       return 'ALL';
  //   }
  // }

  fetchWorkspaceList(type: WorkspaceLoadType): Observable<IWorkspaceListItem[]> {
    return this.http.get<IWorkspaceListItem[]>('api/workspaces', {
      params: {
        type,
      },
    }).pipe(
      map((list) => {
        return list.map(
          (item) => {
            item.type = type === 'ALL' ? 'PRIVATE' : type;
            return item;
          },
        );
      }),
    );
  }

  deleteWorkspace(id: string) {
    return this.http.delete<Message>('api/workspace/' + id);
  }

  getWorkspacesPendingCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>('api/workspace/pending-count');
  }
}
