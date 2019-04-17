import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {catchError, mergeMap} from 'rxjs/operators';
import {IDocumentCreationWrapper} from '../models/ig/document-creation.interface';
import {MessageEventTreeNode} from '../models/message-event/message-event.class';
import {Message, MessageType} from './../../core/models/message/message.class';

@Injectable({
  providedIn: 'root',
})
export class IgService {

  constructor(private http: HttpClient) { }

  cloneIg(id: string): Observable<Message<string>> {
    return this.http.get<Message<string>>('/api/igdocuments/' + id + '/clone').pipe();
  }
  getMessagesByVersion(hl7Version: string): Observable<Message<MessageEventTreeNode[]>> {
    return this.http.get<Message<MessageEventTreeNode[]>>('api/igdocuments/findMessageEvents/' + hl7Version);
  }

  createIntegrationProfile(wrapper: IDocumentCreationWrapper): Observable<Message<string>> {
    return this.http.post<Message<string>>('api/igdocuments/create/', wrapper);
  }

  getIg(id: string): Observable<IgDocument> {
    return this.http.get<any>('/api/igdocuments/' + id);
  }
}
