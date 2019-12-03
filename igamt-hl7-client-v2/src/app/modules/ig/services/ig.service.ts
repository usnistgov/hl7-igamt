import { LocationStrategy } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ISelectedIds } from '../../shared/components/select-resource-ids/select-resource-ids.component';
import {CloneModeEnum} from '../../shared/constants/clone-mode.enum';
import { Type } from '../../shared/constants/type.enum';
import { IConnectingInfo } from '../../shared/models/config.class';
import { IContent } from '../../shared/models/content.interface';
import { IDisplayElement } from '../../shared/models/display-element.interface';
import { IMetadata } from '../../shared/models/metadata.interface';
import { INarrative } from '../components/ig-section-editor/ig-section-editor.component';
import { IG_END_POINT } from '../models/end-points';
import { IDocumentCreationWrapper } from '../models/ig/document-creation.interface';
import { IGDisplayInfo } from '../models/ig/ig-document.class';
import { IgDocument } from '../models/ig/ig-document.class';
import { MessageEventTreeNode } from '../models/message-event/message-event.class';
import {IAddNodes, IAddResourceFromFile, ICopyNode, ICopyResourceResponse} from '../models/toc/toc-operation.class';
import { Message } from './../../core/models/message/message.class';
import { IExportConfigurationGlobal } from './../../export-configuration/models/config.interface';
@Injectable({
  providedIn: 'root',
})
export class IgService {

  readonly EXPORT_URL = '/api/export/ig/';

  constructor(private http: HttpClient, private location: LocationStrategy) {
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

  cloneIg(id: string, mode: CloneModeEnum, data: any): Observable<Message<string>> {
    return this.http.post<Message<string>>(IG_END_POINT + id + '/clone', { mode, data}).pipe();
  }
  publish(id: string): Observable<Message<string>> {
    return this.http.post<Message<string>>(IG_END_POINT + id + '/publish', {}).pipe();
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
    return this.http.post<Message<IGDisplayInfo>>(this.buildAddingUrl(wrapper), wrapper);
  }

  buildAddingUrl(wrapper: IAddNodes): string {
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

  copyResource(payload: ICopyNode) {
    return this.http.post<Message<ICopyResourceResponse>>(this.buildCopyUrl(payload), payload);
  }

  private buildCopyUrl(payload: ICopyNode) {
    switch (payload.selected.type) {
      case Type.CONFORMANCEPROFILE:
        return IG_END_POINT + payload.documentId + '/conformanceprofiles/' + payload.selected.originalId + '/clone';
      case Type.DATATYPE:
        return IG_END_POINT + payload.documentId + '/datatypes/' + payload.selected.originalId + '/clone';
      case Type.SEGMENT:
        return IG_END_POINT + payload.documentId + '/segments/' + payload.selected.originalId + '/clone';
      case Type.VALUESET:
        return IG_END_POINT + payload.documentId + '/valuesets/' + payload.selected.originalId + '/clone';
      default: return null;
    }
  }

  private buildDeleteUrl(documentId: string, element: IDisplayElement) {
    switch (element.type) {
      case Type.CONFORMANCEPROFILE:
        return IG_END_POINT + documentId + '/conformanceprofiles/' + element.id + '/delete';
      case Type.DATATYPE:
        return IG_END_POINT + documentId + '/datatypes/' + element.id + '/delete';
      case Type.SEGMENT:
        return IG_END_POINT + documentId + '/segments/' + element.id + '/delete';
      case Type.VALUESET:
        return IG_END_POINT + documentId + '/valuesets/' + element.id + '/delete';
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
    const form: FormData = new FormData();
    form.append('file', file);
    return this.http.post<{
      link: string,
    }>('/api/storage/upload', form);
  }

  saveMetadata(id: string, metadata: IMetadata): Observable<Message<any>> {
    return this.http.post<Message<string>>(IG_END_POINT + id + '/updatemetadata', metadata);
  }

  deleteResource(documentId: string, element: IDisplayElement): Observable<Message<any>> {
    const url = this.buildDeleteUrl(documentId, element);
    if (url != null) {
      return this.http.delete<Message<any>>(url);
    } else { throwError('Unsupported Url'); }
  }

  exportXML(igId: string, selectedIds: ISelectedIds, xmlFormat) {
    const form = document.createElement('form');
    form.action = this.EXPORT_URL + igId + '/xml/validation';
    form.method = 'POST';
    const json = document.createElement('input');
    json.type = 'hidden';
    json.name = 'json';
    json.value = JSON.stringify(selectedIds);
    form.appendChild(json);
    form.style.display = 'none';
    document.body.appendChild(form);
    form.submit();
  }

  exportAsWord(igId, decision: any) {
    const form = document.createElement('form');
    form.action = this.EXPORT_URL + igId + '/word';
    form.method = 'POST';
    const json = document.createElement('input');
    json.type = 'hidden';
    json.name = 'json';
    json.value = JSON.stringify(decision);
    form.appendChild(json);
    form.style.display = 'none';
    document.body.appendChild(form);
    form.submit();
  }

  export(igId, decision: any, format: string) {
    const form = document.createElement('form');
    form.action = this.EXPORT_URL + igId + '/' + format;
    form.method = 'POST';
    const json = document.createElement('input');
    json.type = 'hidden';
    json.name = 'json';
    json.value = JSON.stringify(decision);
    form.appendChild(json);
    form.style.display = 'none';
    document.body.appendChild(form);
    form.submit();
  }

  exportAsHtml(igId: string, decision: any, configurationId: string) {
    this.submitForm(decision, this.EXPORT_URL + igId + '/configuration/' + configurationId + '/html');
  }

  exportAsHtmlQuick(igId: string) {
    this.submitForm(null, this.EXPORT_URL + igId + '/quickHtml');
  }

  submitForm(decision: any, end_point: string) {
    const form = document.createElement('form');
    form.action = end_point;
    form.method = 'POST';
    if (decision) {
      const json = document.createElement('input');
      json.type = 'hidden';
      json.name = 'json';
      json.value = JSON.stringify(decision);
      form.appendChild(json);
    }
    form.style.display = 'none';
    document.body.appendChild(form);
    form.submit();
  }

  loadDomain(username: string, password: string, tool: IConnectingInfo): Observable<any[]> {

    return this.http.get<any[]>('/api/testing/domains', this.getGvtOptions(username, password, tool));
  }
  getGvtOptions(username: string, password: string, tool: IConnectingInfo) {
    const auth = btoa(username + ':' + password);
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'target-auth': 'Basic ' + auth,
        'target-url': tool.url,
      }),
    };
  }
  exportToTesting(igId: string, selectedIds: ISelectedIds, username: string, password: string, tool: IConnectingInfo, targetDomain: string) {
    return this.http.post('/api/testing/' + igId + '/push/' + targetDomain, selectedIds, this.getGvtOptions(username, password, tool));
  }
  private prepareUrl(igId: string, type: string): string {
    return this.location.prepareExternalUrl('api/export/igdocuments/' + igId + '/export/' + type).replace('#', '');
  }

  getExportFirstDecision(igId: string, configId: string): Observable<IExportConfigurationGlobal> {
    return this.http.get<IExportConfigurationGlobal>('/api/export/igdocuments/' + igId + '/configuration/' + configId + '/getFilteredDocument');
  }

  importFromFile(documentId, resourceType: Type, targetType: Type, file: any) {
    const form: FormData = new FormData();
    form.append('file', file);
    return this.http.post<Message<IAddResourceFromFile>>('/api/igdocuments/' + documentId + '/valuesets/uploadCSVFile', form);
  }
  getDisplay(id: string, delta: boolean) {
    if (delta) {
      return this.http.get<IGDisplayInfo>('api/delta/display/' + id);
    } else {
      return this.getIgInfo(id);
    }
  }
}
