import { LocationStrategy } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import { Message } from '../../dam-framework/models/messages/message.class';
import { ISelectedIds } from '../../shared/components/select-resource-ids/select-resource-ids.component';
import { CloneModeEnum } from '../../shared/constants/clone-mode.enum';
import { Type } from '../../shared/constants/type.enum';
import { IConnectingInfo } from '../../shared/models/config.class';
import { IContent } from '../../shared/models/content.interface';
import { IConformanceStatement } from '../../shared/models/cs.interface';
import { IDisplayElement } from '../../shared/models/display-element.interface';
import { IMetadata } from '../../shared/models/metadata.interface';
import { IRegistry } from '../../shared/models/registry.interface';
import { INarrative } from '../components/ig-section-editor/ig-section-editor.component';
import { IDocumentCreationWrapper } from '../models/ig/document-creation.interface';
import { IGDisplayInfo } from '../models/ig/ig-document.class';
import { IgDocument } from '../models/ig/ig-document.class';
import { MessageEventTreeNode } from '../models/message-event/message-event.class';
import { IAddNodes, IAddResourceFromFile, ICopyNode, ICopyResourceResponse, ICreateCoConstraintGroup, ICreateCoConstraintGroupResponse } from '../models/toc/toc-operation.class';
import { IExportConfigurationGlobal } from './../../export-configuration/models/config.interface';
import { IgTOCNodeHelper } from './ig-toc-node-helper.service';

@Injectable({
  providedIn: 'root',
})
export class IgService {

  readonly EXPORT_URL = '/api/export/ig/';
  readonly IG_END_POINT = '/api/igdocuments/';
  readonly CONFIGURATION = '/configuration/';

  constructor(private http: HttpClient, private location: LocationStrategy) {
  }

  getRegistryAndCollectionByType(type: Type): { registry: string, collection: string } {
    let registry: string;
    let collection: string;

    if (type === Type.VALUESET) {
      registry = 'valueSetRegistry';
      collection = 'valueSets';
    } else if (type === Type.CONFORMANCEPROFILE) {
      registry = 'conformanceProfileRegistry';
      collection = 'messages';
    } else if (type === Type.DATATYPE) {
      registry = 'datatypeRegistry';
      collection = 'datatypes';
    } else if (type === Type.SEGMENT) {
      registry = 'segmentRegistry';
      collection = 'segments';
    } else if (type === Type.COCONSTRAINTGROUP) {
      registry = 'coConstraintGroupRegistry';
      collection = 'coConstraintGroups';
    }

    return { registry, collection };
  }

  loadOrInsertRepositoryFromIgDisplayInfo(igInfo: IGDisplayInfo, load: boolean, values?: string[]): fromDam.InsertResourcesInRepostory | fromDam.LoadResourcesInRepostory {
    const _default = ['segments', 'datatypes', 'messages', 'valueSets', 'coConstraintGroups', 'sections'];
    const collections = (values ? values : _default).map((key) => {
      return {
        key,
        values: key === 'sections' ? IgTOCNodeHelper.getIDisplayFromSections(igInfo.ig.content, '') : igInfo[key],
      };
    });

    return !load ? new fromDam.InsertResourcesInRepostory({
      collections,
    }) : new fromDam.LoadResourcesInRepostory({
      collections,
    });
  }

  loadRepositoryFromIgDisplayInfo(igInfo: IGDisplayInfo, values?: string[]): Action {
    return this.loadOrInsertRepositoryFromIgDisplayInfo(igInfo, true, values);
  }

  insertRepositoryFromIgDisplayInfo(igInfo: IGDisplayInfo, values?: string[]): Action {
    return this.loadOrInsertRepositoryFromIgDisplayInfo(igInfo, false, values);
  }

  insertRepositoryCopyResource(registryList: IRegistry, display: IDisplayElement, ig: IgDocument): Action[] {
    const { registry, collection } = this.getRegistryAndCollectionByType(display.type);
    return [
      ...(registry ? [new fromDam.LoadPayloadData({
        ...ig,
        [registry]: registryList,
      })] : []),
      ...(collection ? [new fromDam.InsertResourcesInRepostory({
        collections: [{
          key: collection,
          values: [display],
        }],
      })] : []),
    ];
  }

  deleteOneFromRepository(display: IDisplayElement, ig: IgDocument): Action[] {
    const { registry, collection } = this.getRegistryAndCollectionByType(display.type);
    return [
      ...(registry ? [new fromDam.LoadPayloadData({
        ...ig,
        [registry]: this.removeById(ig[registry], display.id),
      })] : []),
      ...(collection ? [new fromDam.DeleteResourcesFromRepostory({
        collections: [{
          key: collection,
          values: [display.id],
        }],
      })] : []),
    ];
  }

  updateSections(sections: IDisplayElement[], ig: IgDocument): Action[] {
    const content: IContent[] = IgTOCNodeHelper.updateSections(sections);
    const sectionList: IDisplayElement[] = IgTOCNodeHelper.getIDisplayFromSections(content, '');
    return [
      new fromDam.LoadPayloadData({
        ...ig,
        content,
      }),
      new fromDam.InsertResourcesInRepostory({
        collections: [{
          key: 'sections',
          values: sectionList,
        }],
      }),
      new fromDam.SetValue({
        tableOfContentEdit: {
          changed: true,
        },
      }),
    ];
  }

  removeById(reg: IRegistry, id: string): IRegistry {
    return { ...reg, children: reg.children.filter((elm) => elm.id !== id) };
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
    return this.http.post<Message<string>>(this.IG_END_POINT + id + '/clone', { mode, data }).pipe();
  }

  publish(id: string): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.IG_END_POINT + id + '/publish', {}).pipe();
  }

  updateSharedUsers(sharedUsers: any, id: string): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.IG_END_POINT + id + '/updateSharedUser', sharedUsers).pipe();
  }

  getMessagesByVersion(hl7Version: string): Observable<Message<MessageEventTreeNode[]>> {
    return this.http.get<Message<MessageEventTreeNode[]>>(this.IG_END_POINT + 'findMessageEvents/' + hl7Version);
  }

  createIntegrationProfile(wrapper: IDocumentCreationWrapper): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.IG_END_POINT + 'create/', wrapper);
  }

  getIgInfo(id: string): Observable<IGDisplayInfo> {
    return this.http.get<IGDisplayInfo>(this.IG_END_POINT + id + '/state');
  }

  addResource(wrapper: IAddNodes): Observable<Message<IGDisplayInfo>> {
    return this.http.post<Message<IGDisplayInfo>>(this.buildAddingUrl(wrapper), wrapper);
  }

  createCoConstraintGroup(request: ICreateCoConstraintGroup): Observable<Message<ICreateCoConstraintGroupResponse>> {
    return this.http.post<Message<ICreateCoConstraintGroupResponse>>(this.IG_END_POINT + request.documentId + '/co-constraint-group/create', request);
  }

  buildAddingUrl(wrapper: IAddNodes): string {
    switch (wrapper.type) {
      case Type.EVENTS:
        return this.IG_END_POINT + wrapper.documentId + '/conformanceprofiles/add';
      case Type.DATATYPE:
        return this.IG_END_POINT + wrapper.documentId + '/datatypes/add';
      case Type.SEGMENT:
        return this.IG_END_POINT + wrapper.documentId + '/segments/add';
      case Type.VALUESET:
        return this.IG_END_POINT + wrapper.documentId + '/valuesets/add';
      default: return null;
    }
  }

  copyResource(payload: ICopyNode) {
    return this.http.post<Message<ICopyResourceResponse>>(this.buildCopyUrl(payload), payload);
  }

  private buildCopyUrl(payload: ICopyNode) {
    switch (payload.selected.type) {
      case Type.CONFORMANCEPROFILE:
        return this.IG_END_POINT + payload.documentId + '/conformanceprofiles/' + payload.selected.originalId + '/clone';
      case Type.DATATYPE:
        return this.IG_END_POINT + payload.documentId + '/datatypes/' + payload.selected.originalId + '/clone';
      case Type.SEGMENT:
        return this.IG_END_POINT + payload.documentId + '/segments/' + payload.selected.originalId + '/clone';
      case Type.VALUESET:
        return this.IG_END_POINT + payload.documentId + '/valuesets/' + payload.selected.originalId + '/clone';
      default: return null;
    }
  }

  private buildDeleteUrl(documentId: string, element: IDisplayElement) {
    switch (element.type) {
      case Type.CONFORMANCEPROFILE:
        return this.IG_END_POINT + documentId + '/conformanceprofiles/' + element.id + '/delete';
      case Type.DATATYPE:
        return this.IG_END_POINT + documentId + '/datatypes/' + element.id + '/delete';
      case Type.SEGMENT:
        return this.IG_END_POINT + documentId + '/segments/' + element.id + '/delete';
      case Type.VALUESET:
        return this.IG_END_POINT + documentId + '/valuesets/' + element.id + '/delete';
      default: return null;
    }
  }

  saveTextSection(id: string, narrative: INarrative): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.IG_END_POINT + id + '/section', narrative);
  }

  saveTextSections(id: string, content: IContent[]): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.IG_END_POINT + id + '/update/sections', content);
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
    return this.http.post<Message<string>>(this.IG_END_POINT + id + '/updatemetadata', metadata);
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

  exportAsWord(igId: string, decision: any, configurationId: string) {
    this.submitForm(decision, this.EXPORT_URL + igId + this.CONFIGURATION + configurationId + '/word');
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
    this.submitForm(decision, this.EXPORT_URL + igId + this.CONFIGURATION + configurationId + '/html');
  }

  exportAsHtmlQuick(igId: string) {
    this.submitForm(null, this.EXPORT_URL + igId + '/quickHtml');
  }

  exportAsWordQuick(igId: string) {
    this.submitForm(null, this.EXPORT_URL + igId + '/quickWord');
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
    return this.http.get<IExportConfigurationGlobal>('/api/export/igdocuments/' + igId + this.CONFIGURATION + configId + '/getFilteredDocument');
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

  getConformanceStatementSummary(id: string): Observable<IConformanceStatement[]> {
    return this.http.get<IConformanceStatement[]>('api/igdocuments/' + id + '/conformancestatement/summary');
  }
}
