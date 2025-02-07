import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../../dam-framework/models/messages/message.class';
import { IShareExportConfiguration } from '../components/ig-share-link-dialog/ig-share-link-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ExportShareService {
  readonly IG_API_BASE = '/api/igdocuments/';
  readonly SHARE_LINK = '/sharelink/';
  constructor(private http: HttpClient) { }

  getShareLinks(igId: string): Observable<Record<string, IShareExportConfiguration>> {
    return this.http.get<Record<string, IShareExportConfiguration>>(this.IG_API_BASE + igId + this.SHARE_LINK);
  }

  createLink(igId: string, configuration: IShareExportConfiguration): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.IG_API_BASE + igId + this.SHARE_LINK, configuration);
  }

  saveLink(igId: string, linkId: string, configuration: IShareExportConfiguration): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.IG_API_BASE + igId + this.SHARE_LINK + linkId, configuration);
  }

  deleteLink(igId: string, linkId: string): Observable<Message<string>> {
    return this.http.delete<Message<string>>(this.IG_API_BASE + igId + this.SHARE_LINK + linkId);
  }

}
