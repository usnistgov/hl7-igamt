import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Type } from '../../shared/constants/type.enum';
import { IContent } from '../../shared/models/content.interface';
import { IDisplayElement } from '../../shared/models/display-element.interface';
import { IMetadata } from '../../shared/models/metadata.interface';
import { INarrative } from '../components/ig-section-editor/ig-section-editor.component';
import { IG_END_POINT } from '../models/end-points';
import { IDocumentCreationWrapper } from '../models/ig/document-creation.interface';
import { IgDocument } from '../models/ig/ig-document.class';
import { IGDisplayInfo } from '../models/ig/ig-document.class';
import { MessageEventTreeNode } from '../models/message-event/message-event.class';
import { IAddNodes } from '../models/toc/toc-operation.class';
import { Message } from './../../core/models/message/message.class';

@Injectable({
  providedIn: 'root',
})
export class IgService {

  // @ts-ignore
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

  saveTextSection(id: string, narrative: INarrative): Observable<Message<string>> {
    return this.http.post<Message<string>>(IG_END_POINT + id + '/section', narrative);
  }

  saveTextSections(id: string, content: IContent[]): Observable<Message<string>> {
    return this.http.post<Message<string>>(IG_END_POINT + id + '/update/sections', content);
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
    return this.http.post<Message<string>>(IG_END_POINT + id + '/updatemetadata', metadata);
  }

}