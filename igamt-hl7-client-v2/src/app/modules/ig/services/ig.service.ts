import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Type } from '../../shared/constants/type.enum';
import { IContent } from '../../shared/models/content.interface';
import { IDisplayElement } from '../../shared/models/display-element.interface';
import { IMetadata } from '../../shared/models/metadata.interface';
import { INarrative } from '../components/ig-section-editor/ig-section-editor.component';
import { IDocumentCreationWrapper } from '../models/ig/document-creation.interface';
import { IGDisplayInfo, IgDocument } from '../models/ig/ig-document.class';
import { MessageEventTreeNode } from '../models/message-event/message-event.class';
import { Message } from './../../core/models/message/message.class';

@Injectable({
  providedIn: 'root',
})
export class IgService {

  constructor(private http: HttpClient) {
  }

  igToIDisplayElement(ig: IgDocument): IDisplayElement {
    return {
      id: ig.id,
      fixedName: ig.metadata.title,
      variableName: ig.metadata.subTitle,
      description: ig.metadata.implementationNotes,
      domainInfo: ig.domainInfo,
      type: Type.IGDOCUMENT,
      leaf: true,
      differential: !!ig.origin,
      isExpanded: true,
    };
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

  saveTextSection(id: string, narrative: INarrative): Observable<Message<string>> {
    return this.http.post<Message<string>>('/api/igdocuments/' + id + '/section', narrative);
  }

  saveTextSections(id: string, content: IContent[]): Observable<Message<string>> {
    return this.http.post<Message<string>>('/api/igdocuments/' + id + '/update/sections', content);
  }

  uploadCoverImage(file: File): Observable<{
    link: string,
  }> {
    console.log(file);
    const form: FormData = new FormData();
    form.append('file', file);
    return this.http.post<{
      link: string,
    }>('/api/storage/upload', form);
  }

  saveMetadata(id: string, metadata: IMetadata): Observable<Message<string>> {
    return this.http.post<Message<string>>('/api/igdocuments/' + id + '/updatemetadata', metadata);
  }

}
