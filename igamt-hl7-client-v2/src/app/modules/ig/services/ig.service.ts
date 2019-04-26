import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IDocumentCreationWrapper} from '../models/ig/document-creation.interface';
import {IGDisplayInfo} from '../models/ig/ig-document.class';
import {MessageEventTreeNode} from '../models/message-event/message-event.class';
import {Message} from './../../core/models/message/message.class';

@Injectable({
  providedIn: 'root',
})
export class IgService {

  constructor(private http: HttpClient) {
  }

  cloneIg(id: string): Observable<Message<string>> {
    return this.http.get<Message<string>>('/api/igdocuments/' + id + '/clone').pipe();
  }

  getMessagesByVersion(hl7Version: string): Observable<Message<MessageEventTreeNode[]>> {
    return this.http.get<Message<MessageEventTreeNode[]>>('api/igdocuments/findMessageEvents/' + hl7Version);
  }

  createIntegrationProfile(wrapper: IDocumentCreationWrapper): Observable<Message<string>> {
    return this.http.post<Message<string>>('api/igdocuments/create/', wrapper);
  }

  getIgInfo(id: string): Observable<IGDisplayInfo> {
    return this.http.get<IGDisplayInfo>('/api/igdocuments/' + id + '/state');
  }

}
