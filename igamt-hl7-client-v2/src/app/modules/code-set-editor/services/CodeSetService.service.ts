import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CodeSetLoadType } from 'src/app/root-store/code-set-editor/code-set-list/code-set-list.actions';
import { Message } from '../../dam-framework/models/messages/message.class';
import { LoadPayloadData, LoadResourcesInRepostory } from '../../dam-framework/store';
import { ICodeSetInfo, ICodeSetListItem, ICodeSetVersionContent } from '../models/code-set.models';

@Injectable({
  providedIn: 'root',
})
export class CodeSetServiceService {

  constructor(
    private http: HttpClient,
    private store: Store<any>,
  ) {
  }

  readonly CODE_SET_END_POINT = '/api/code-set/';
  saveDashBoard(id: string, data: ICodeSetInfo): Observable<Message<string>>  {
    throw new Error('Method not implemented.');
  }

  saveCodeSetVersion( codeSetId: string, versionId: string, resource: ICodeSetVersionContent): Observable<Message<string>>  {
    return this.http.post<Message<string>>(this.CODE_SET_END_POINT + codeSetId + '/code-set-version/' + versionId, resource);
  }

  commitCodeSetVersion( codeSetId: string, versionId: string, resource: ICodeSetVersionContent): Observable<Message<string>>  {
    return this.http.post<Message<string>>(this.CODE_SET_END_POINT + codeSetId + '/code-set-version/' + versionId + '/commit', resource);
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

  upload(id: string, file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post('api/code-sets/importCSV/' + id, formData);
  }

  exportCSV(id: String) {
    const form = document.createElement('form');
    form.action = 'api/code-sets/exportCSV/' + id;
    form.method = 'POST';
    form.style.display = 'none';
    document.body.appendChild(form);
    form.submit();
  }

}

export interface ICodeSetCreateRequest {
  title: string;
  description: string;
}
