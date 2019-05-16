import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Type} from '../../shared/constants/type.enum';
import {IG_END_POINT} from '../models/end-points';
import {IDocumentCreationWrapper} from '../models/ig/document-creation.interface';
import {IGDisplayInfo} from '../models/ig/ig-document.class';
import {MessageEventTreeNode} from '../models/message-event/message-event.class';
import {IAddNodes} from '../models/toc/toc-operation.class';
import {Message} from './../../core/models/message/message.class';

@Injectable({
  providedIn: 'root',
})
export class IgService {

  // @ts-ignore
  constructor(private http: HttpClient) {
  }

  cloneIg(id: string): Observable<Message<string>> {
    return this.http.get<Message<string>>(IG_END_POINT + id + '/clone').pipe();
  }

  getMessagesByVersion(hl7Version: string): Observable<Message<MessageEventTreeNode[]>> {
    return this.http.get<Message<MessageEventTreeNode[]>>(IG_END_POINT + 'findMessageEvents/' + hl7Version);
  }

  createIntegrationProfile(wrapper: IDocumentCreationWrapper): Observable<Message<string>> {
    return this.http.post<Message<string>>(IG_END_POINT + 'create/', wrapper);
  }

  getIgInfo(id: string): Observable<IGDisplayInfo> {
    return this.http.get<IGDisplayInfo>(IG_END_POINT + id + '/state');
  }

  addResource(wrapper: IAddNodes): Observable<Message<IGDisplayInfo>> {
    return this.http.post<Message<IGDisplayInfo>>(this.buildUrl(wrapper), wrapper);

  }

  buildUrl(wrapper: IAddNodes): string {
    switch (wrapper.type) {
      case Type.EVENTS:
        return IG_END_POINT + wrapper.documentId + '/conformanceprofiles/add';
      case Type.DATATYPE:
        return IG_END_POINT + wrapper.documentId + '/datatypes/add';
      case Type.SEGMENT:
        return IG_END_POINT + wrapper.documentId + '/segments/add';
      case Type.VALUESET:
        return IG_END_POINT + wrapper.documentId + '/valuesets/add';
      default: return null;
    }
  }

}
