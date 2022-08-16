import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IWorkspaceInfo } from '../../workspace/models/models';
import { Type } from '../constants/type.enum';

export interface IDocumentMoveInfo {
  documentId: string;
  documentType: Type;
  workspaceId: string;
  folderId: string;
}

@Injectable({
  providedIn: 'root',
})
export class MoveService {

  constructor(
    private http: HttpClient,
  ) { }

  moveToWorkspace(info: IDocumentMoveInfo): Observable<IWorkspaceInfo> {
    return this.http.post<IWorkspaceInfo>('/api/move/workspace', info);
  }
}
