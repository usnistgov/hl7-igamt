import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CodeSetLoadType } from 'src/app/root-store/code-set-editor/code-set-list/code-set-list.actions';
import { IVerificationEnty } from '../../dam-framework';
import { Message } from '../../dam-framework/models/messages/message.class';
import { LoadPayloadData, LoadResourcesInRepostory } from '../../dam-framework/store';
import { ICodes } from '../../shared/models/value-set.interface';
import { ICodeDelta, ICodeSetCommit, ICodeSetInfo, ICodeSetListItem, ICodeSetVersionContent } from '../models/code-set.models';

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
  readonly CODE_SET_VERSION_END_POINT = '/code-set-version/';

  saveDashBoard(id: string, data: ICodeSetInfo): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.CODE_SET_END_POINT + id + '/applyInfo/', data);
  }

  saveCodeSetVersion(codeSetId: string, versionId: string, codes: ICodes[]): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.CODE_SET_END_POINT + codeSetId + this.CODE_SET_VERSION_END_POINT + versionId, codes);
  }

  commitCodeSetVersion(codeSetId: string, versionId: string, codeSetCommit: ICodeSetCommit): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.CODE_SET_END_POINT + codeSetId + this.CODE_SET_VERSION_END_POINT + versionId + '/commit', codeSetCommit);
  }

  getCodeSetInfo(id: string): Observable<ICodeSetInfo> {
    return this.http.get<ICodeSetInfo>(this.CODE_SET_END_POINT + id + '/state');
  }

  createCodeSet(wrapper: ICodeSetCreateRequest): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.CODE_SET_END_POINT + 'create/', wrapper);
  }

  getCodeSetVersionContent(codeSetId: string, versionId: string): Observable<ICodeSetVersionContent> {
    return this.http.get<ICodeSetVersionContent>(this.CODE_SET_END_POINT + codeSetId + this.CODE_SET_VERSION_END_POINT + versionId);
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
    return this.http.delete<Message>(this.CODE_SET_END_POINT + id);
  }

  cloneCodeSet(id: string) {
    return this.http.post<Message>(this.CODE_SET_END_POINT + id + '/clone', {});
  }

  publishCodeSet(id: string) {
    return this.http.post<Message>(this.CODE_SET_END_POINT + id + '/publish', {});
  }

  upload(id: string, file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post('api/code-sets/importCSV/' + id, formData);
  }

  exportCSV(id: string) {
    const form = document.createElement('form');
    form.action = 'api/code-sets/exportCSV/' + id;
    form.method = 'POST';
    form.style.display = 'none';
    document.body.appendChild(form);
    form.submit();
  }

  updateViewers(viewers: string[], id: string): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.CODE_SET_END_POINT + id + '/updateViewers', viewers).pipe();
  }

  deleteCodeSetVersion(version: any): Observable<Message<string>> {
    return this.http.delete<Message<string>>(this.CODE_SET_END_POINT + version.parentId + this.CODE_SET_VERSION_END_POINT + version.id);
  }

  getCodeSetVersionLatest(codeSetId: string): Observable<ICodeSetVersionContent> {
    return this.http.get<ICodeSetVersionContent>(this.CODE_SET_END_POINT + codeSetId + '/latest');
  }

  getCodeSetDelta(codeSetId: string, sourceVersionId: string, targetVersionId: string): Observable<ICodeDelta[]> {
    return this.http.get<ICodeDelta[]>(this.CODE_SET_END_POINT + codeSetId + '/compare/' + sourceVersionId + '/' + targetVersionId);
  }

  verifyCodeSet(codeSetId: string, codeSetVersionId: string): Observable<IVerificationEnty[]> {
    return this.http.post<IVerificationEnty[]>(`/api/code-set/${codeSetId}/code-set-version/${codeSetVersionId}/verify`, {});
  }

}

export interface ICodeSetCreateRequest {
  title: string;
  description: string;
}
