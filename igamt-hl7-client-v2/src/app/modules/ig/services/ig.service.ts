import { LocationStrategy } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {el} from '@angular/platform-browser/testing/src/browser_util';
import { Action } from '@ngrx/store';
import {Observable, of, throwError} from 'rxjs';
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import { TableOfContentSave } from '../../../root-store/ig/ig-edit/ig-edit.actions';
import { Message } from '../../dam-framework/models/messages/message.class';
import { IDocumentCreationWrapper } from '../../document/models/document/document-creation.interface';
import { MessageEventTreeNode } from '../../document/models/message-event/message-event.class';
import {
  IAddNodes, IAddProfileComponentContext, IAddResourceFromFile, ICopyNode, ICopyResourceResponse,
  ICreateCoConstraintGroup,
  ICreateCoConstraintGroupResponse, ICreateCompositeProfile, ICreateProfileComponent, ICreateProfileComponentResponse,
} from '../../document/models/toc/toc-operation.class';
import { IgTOCNodeHelper } from '../../document/services/ig-toc-node-helper.service';
import {ExportTypes} from '../../export-configuration/models/export-types';
import { ISelectedIds } from '../../shared/components/select-resource-ids/select-resource-ids.component';
import { CloneModeEnum } from '../../shared/constants/clone-mode.enum';
import { Scope } from '../../shared/constants/scope.enum';
import { Type } from '../../shared/constants/type.enum';
import { IConnectingInfo } from '../../shared/models/config.class';
import { IContent } from '../../shared/models/content.interface';
import { IConformanceStatement } from '../../shared/models/cs.interface';
import { IDisplayElement } from '../../shared/models/display-element.interface';
import { IMetadata } from '../../shared/models/metadata.interface';
import { IRegistry } from '../../shared/models/registry.interface';
import { IgTemplate } from '../components/derive-dialog/derive-dialog.component';
import { INarrative } from '../components/ig-section-editor/ig-section-editor.component';
import { IDocumentDisplayInfo } from '../models/ig/ig-document.class';
import { IgDocument } from '../models/ig/ig-document.class';
import { IExportConfigurationGlobal } from './../../export-configuration/models/config.interface';

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
    if (type === Type.VALUESET ||type ===  Type.VALUESETREGISTRY) {
      registry = 'valueSetRegistry';
      collection = 'valueSets';
    } else if (type === Type.CONFORMANCEPROFILE ||  type === Type.CONFORMANCEPROFILEREGISTRY ) {
      registry = 'conformanceProfileRegistry';
      collection = 'messages';
    } else if (type === Type.DATATYPE || type === Type.DATATYPEREGISTRY) {
      registry = 'datatypeRegistry';
      collection = 'datatypes';
    } else if (type === Type.SEGMENT || type === Type.SEGMENTREGISTRY) {
      registry = 'segmentRegistry';
      collection = 'segments';
    } else if (type === Type.COCONSTRAINTGROUP || type === Type.COCONSTRAINTGROUPREGISTRY) {
      registry = 'coConstraintGroupRegistry';
      collection = 'coConstraintGroups';
    } else if (type === Type.PROFILECOMPONENT || type === Type.PROFILECOMPONENTREGISTRY) {
      registry = 'profileComponentRegistry';
      collection = 'profileComponents';
    } else if (type === Type.COMPOSITEPROFILE || type === Type.COMPOSITEPROFILEREGISTRY) {
      registry = 'compositeProfileRegistry';
      collection = 'compositeProfiles';
    }
    return { registry, collection };
  }

  loadOrInsertRepositoryFromIgDisplayInfo(igInfo: IDocumentDisplayInfo<IgDocument>, load: boolean, values?: string[]): fromDam.InsertResourcesInRepostory | fromDam.LoadResourcesInRepostory {
    const _default = ['segments', 'datatypes', 'messages', 'valueSets', 'coConstraintGroups', 'profileComponents', 'compositeProfiles',  'sections'];
    console.log('loading');
    const collections = (values ? values : _default).map((key) => {
      return {
        key,
        values: key === 'sections' ? IgTOCNodeHelper.getIDisplayFromSections(igInfo.ig.content, '') : igInfo[key],
      };
    });
    if (igInfo.profileComponents !== null ) {
      let childrenArray = [];
      igInfo['profileComponents'].forEach((x) => childrenArray = childrenArray.concat(x.children));
      collections.push({key: 'contexts', values: childrenArray});
    }
    return !load ? new fromDam.InsertResourcesInRepostory({
      collections,
    }) : new fromDam.LoadResourcesInRepostory({
      collections,
    });
  }

  loadRepositoryFromIgDisplayInfo(igInfo: IDocumentDisplayInfo<IgDocument>, values?: string[]): Action {
    return this.loadOrInsertRepositoryFromIgDisplayInfo(igInfo, true, values);
  }

  insertRepositoryFromIgDisplayInfo(igInfo: IDocumentDisplayInfo<IgDocument>, values?: string[]): Action {
    return this.loadOrInsertRepositoryFromIgDisplayInfo(igInfo, false, values);
  }

  insertRepositoryCopyResource(registryList: IRegistry, display: IDisplayElement, ig: IgDocument): Action[] {
    const { registry, collection } = this.getRegistryAndCollectionByType(display.type);
    const collections = [{
      key: collection,
      values: [display],
    }];
    if (display.type === Type.PROFILECOMPONENT && display.children ) {
      collections.push({key: 'contexts' , values: display.children });
    }
    return [
      ...(registry ? [new fromDam.LoadPayloadData({
        ...ig,
        [registry]: registryList,
      })] : []),
      ...(collection ? [new fromDam.InsertResourcesInRepostory({
         collections,
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

  deleteListFromRepository(ids: string[], ig: IgDocument, registryType: Type): Action[] {
    const { registry, collection } = this.getRegistryAndCollectionByType(registryType);
    return [
      ...(registry ? [new fromDam.LoadPayloadData({
        ...ig,
        [registry]: this.removeByIdIn(ig[registry], ids),
      })] : []),
      ...(collection ? [new fromDam.DeleteResourcesFromRepostory({
        collections: [{
          key: collection,
          values: ids,
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
      new TableOfContentSave({
        sections: content, id: ig.id,
      }),
    ];
  }

  removeById(reg: IRegistry, id: string): IRegistry {
    return { ...reg, children: reg.children.filter((elm) => elm.id !== id) };
  }
  removeByIdIn(reg: IRegistry, ids: string[]): IRegistry {

    return { ...reg, children: reg.children.filter((elm) => ids.indexOf(elm.id)<0) };
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
    return this.http.post<Message<string>>(this.IG_END_POINT + id + '/clone', data).pipe();
  }

  publish(id: string, publicationInfo: any): Observable<Message<string>> {
    console.log(publicationInfo);
    return this.http.post<Message<string>>(this.IG_END_POINT + id + '/publish', publicationInfo).pipe();
  }

  updateSharedUsers(sharedUsers: any, id: string): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.IG_END_POINT + id + '/updateSharedUser', sharedUsers).pipe();
  }

  getMessagesByVersionAndScope(hl7Version: string, scope: Scope): Observable<Message<MessageEventTreeNode[]>> {
    return this.http.get<Message<MessageEventTreeNode[]>>(this.IG_END_POINT + 'findMessageEvents/' + scope + '/' + hl7Version);
  }

  createIntegrationProfile(wrapper: IDocumentCreationWrapper): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.IG_END_POINT + 'create/', wrapper);
  }

  getIgInfo(id: string): Observable<IDocumentDisplayInfo<IgDocument>> {
    return this.http.get<IDocumentDisplayInfo<IgDocument>>(this.IG_END_POINT + id + '/state');
  }

  addResource(wrapper: IAddNodes): Observable<Message<IDocumentDisplayInfo<IgDocument>>> {
    return this.http.post<Message<IDocumentDisplayInfo<IgDocument>>>(this.buildAddingUrl(wrapper), wrapper);
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
      case Type.PROFILECOMPONENT:
        return this.IG_END_POINT + payload.documentId + '/' + 'profile-component/' + payload.selected.originalId + '/clone';
      case Type.COMPOSITEPROFILE:
        return this.IG_END_POINT + payload.documentId + '/composite-profile/' + payload.selected.originalId + '/clone';
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
      case Type.COCONSTRAINTGROUP:
        return this.IG_END_POINT + documentId + '/co-constraint-group/' + element.id + '/delete';
      case Type.PROFILECOMPONENT:
        // tslint:disable-next-line:no-duplicate-string
        return this.IG_END_POINT + documentId + '/profile-component/' + element.id + '/delete';
      case Type.COMPOSITEPROFILE:
        return this.IG_END_POINT + documentId + '/composite-profile/' + element.id + '/delete';
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

  deleteResources(documentId: string, ids: string[], registryType: Type): Observable<string[]> {
    // const options = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //   }),
    //   body: {
    //     ids: ids,
    //   }

    // };
    return this.http.post<string[]>(this.IG_END_POINT + documentId + '/'+registryType+ '/deleteResources', ids);
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

  export(igId, decision: any, format: string, configId: string , exportType: ExportTypes ) {
    const form = document.createElement('form');
    form.action = this.EXPORT_URL + igId + '/' + format + '?deltamode=TEST';
    form.method = 'POST';

    const json = document.createElement('input');
    json.type = 'hidden';
    json.name = 'json';
    json.value = JSON.stringify(decision);
    form.appendChild(json);

    const config = document.createElement('input');
    config.type = 'hidden';
    config.name = 'configId';
    config.value = configId;
    form.appendChild(config);

    const documentType = document.createElement('input');
    documentType.type = 'hidden';
    documentType.name = 'exportType';
    documentType.value = exportType;
    form.appendChild(documentType);

    form.style.display = 'none';
    document.body.appendChild(form);
    form.submit();
  }

  exportAsHtml(igId: string, decision: any, configurationId: string, exportType: ExportTypes) {
    this.submitForm(decision, this.EXPORT_URL + igId + '/html', configurationId, exportType );
  }

  exportDiffXML(igId: string) {
    this.submitForm(null, this.EXPORT_URL + igId + '/xml/diff', null, null);
  }
  exportProfileDiffXML(igId: string, profileId) {
    this.submitForm(null, this.EXPORT_URL + igId + '/' + profileId + '/xml/diff', null, null);
  }

  exportDocument(igId: string, decision: any,  configId: string , exportType: ExportTypes, format: string) {
    this.submitForm(decision, this.EXPORT_URL + igId + '/' + format, configId, exportType);
  }

  submitForm(decision: any, end_point: string, configId: string , exportType: ExportTypes) {
    const form = document.createElement('form');
    const documentType = document.createElement('input');
    documentType.type = 'hidden';
    documentType.name = 'documentType';
    documentType.value = exportType;
    form.appendChild(documentType);
    form.action = end_point;
    form.method = 'POST';
    if (decision) {
      const json = document.createElement('input');
      json.type = 'hidden';
      json.name = 'json';
      json.value = JSON.stringify(decision);
      form.appendChild(json);
    }
    const config = document.createElement('input');
    config.type = 'hidden';
    config.name = 'config';
    config.value = configId;
    form.appendChild(config);
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

  getExportFirstDecision = (igId: string, configId: string): Observable<IExportConfigurationGlobal> => {
    return this.http.get<IExportConfigurationGlobal>(this.EXPORT_URL + igId + this.CONFIGURATION + configId + '/getFilteredDocument');
  }

  getLastUserConfiguration = (igId: string): Observable<IExportConfigurationGlobal> => {
    return this.http.get<IExportConfigurationGlobal>(this.EXPORT_URL + igId + '/getLastUserConfiguration');
  }

  importFromFile(documentId, resourceType: Type, targetType: Type, file: any) {
    const form: FormData = new FormData();
    form.append('file', file);
    return this.http.post<Message<IAddResourceFromFile>>('/api/igdocuments/' + documentId + '/valuesets/uploadCSVFile', form);
  }

  getDisplay(id: string, delta: boolean) {
    if (delta) {
      return this.http.get<IDocumentDisplayInfo<IgDocument>>('api/delta/display/' + id);
    } else {
      return this.getIgInfo(id);
    }
  }

  getConformanceStatementSummary(id: string): Observable<IConformanceStatement[]> {
    return this.http.get<IConformanceStatement[]>('api/igdocuments/' + id + '/conformancestatement/summary');
  }

  loadTemplate(): Observable<IgTemplate[]> {
    return this.http.get<IgTemplate[]>('api/igdocuments/igTemplates');
  }

  createProfileComponent(request: ICreateProfileComponent): Observable<Message<ICreateProfileComponentResponse>> {
    return this.http.post<Message<ICreateProfileComponentResponse>>(this.IG_END_POINT + request.documentId + '/profile-component/create', request);
  }

  addProfileComponentContext(request: IAddProfileComponentContext): Observable<Message<ICreateProfileComponentResponse>> {
    return this.http.post<Message<ICreateProfileComponentResponse>>(this.IG_END_POINT + request.documentId + '/profile-component/' + request.pcId + '/addChildren', request.added);
  }

  deleteContext(documentId: string, element: IDisplayElement, parent: IDisplayElement): Observable<IDisplayElement> {
    return this.http.post<IDisplayElement>(this.IG_END_POINT + documentId + '/profile-component/' + parent.id + '/removeContext' , element.id);
  }

  createCompositeProfile(request: ICreateCompositeProfile): Observable<Message<ICreateProfileComponentResponse>> {
    return this.http.post<Message<ICreateProfileComponentResponse>>(this.IG_END_POINT + request.documentId + '/composite-profile/create', request);
  }


}
