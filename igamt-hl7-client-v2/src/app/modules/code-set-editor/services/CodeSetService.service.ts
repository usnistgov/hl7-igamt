import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Message } from '../../dam-framework/models/messages/message.class';
import { ICodeSetInfo, ICodeSetListItem, ICodeSetVersionContent } from '../models/code-set.models';
import { LoadPayloadData, LoadResourcesInRepostory } from '../../dam-framework/store';
import { CodeSetLoadType } from 'src/app/root-store/code-set-editor/code-set-list/code-set-list.actions';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CodeSetServiceService {


  saveCodeSetVersion( codeSetId: string, versionId: string, resource: ICodeSetVersionContent) : Observable<Message<string>>  {
    return this.http.post<Message<string>>(this.CODE_SET_END_POINT + codeSetId + '/code-set-version/' + versionId, resource);
  }

  readonly CODE_SET_END_POINT = '/api/code-set/';

  constructor(
    private http: HttpClient,
    private store: Store<any>,
  ) {
  }

  getCodeSetInfo(id: string): Observable<ICodeSetInfo> {
    return this.http.get<ICodeSetInfo>(this.CODE_SET_END_POINT + id + '/state');
  }

  createCodeSet(wrapper: ICodeSetCreateRequest): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.CODE_SET_END_POINT + 'create/', wrapper);
  }

  getCodeSetVersionContent(codeSetId: string, versionId: string): Observable<ICodeSetVersionContent> {
    return this.http.get<ICodeSetVersionContent>(this.CODE_SET_END_POINT + codeSetId + '/code-set-version/' + versionId);
  }
  getUpdateAction(codeSetInfo: ICodeSetInfo): Action[] {
    return [
      new LoadPayloadData(codeSetInfo),
      new LoadResourcesInRepostory({
        collections: [{
          key: 'codeSetVersions',
          values: codeSetInfo.children,
        }],
      }),
    ];
  }







  fetchCodeSetList(type: CodeSetLoadType): Observable<ICodeSetListItem[]> {
    return this.http.get<ICodeSetListItem[]>('api/code-sets', {
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

  deleteCodeSet(id: string) {
    return this.http.delete<Message>('api/code-set/' + id);
  }




}

export interface ICodeSetCreateRequest {
  title: string;
  description: string;
}
