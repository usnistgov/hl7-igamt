import { LocationStrategy } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import {TableOfContentSave} from '../../../root-store/library/library-edit/library-edit.actions';
import { Message } from '../../dam-framework/models/messages/message.class';
import {IDocumentCreationWrapper} from '../../document/models/document/document-creation.interface';
import {IDocument} from '../../document/models/document/IDocument.interface';
import {IAddNodes, ICopyNode, ICopyResourceResponse} from '../../document/models/toc/toc-operation.class';
import {IDocumentDisplayInfo} from '../../ig/models/ig/ig-document.class';
import { ISelectedIds } from '../../shared/components/select-resource-ids/select-resource-ids.component';
import { CloneModeEnum } from '../../shared/constants/clone-mode.enum';
import { Type } from '../../shared/constants/type.enum';
import { IContent } from '../../shared/models/content.interface';
import { IDisplayElement } from '../../shared/models/display-element.interface';
import { IMetadata } from '../../shared/models/metadata.interface';
import { IRegistry } from '../../shared/models/registry.interface';
import { INarrative } from '../components/library-section-editor/library-section-editor.component';
import {
  IPublicationResult,
  IPublicationSummary,
} from '../components/publish-library-dialog/publish-library-dialog.component';
import {ILibrary} from '../models/library.class';
import { IExportConfigurationGlobal } from './../../export-configuration/models/config.interface';
import { IgTOCNodeHelper } from './library-toc-node-helper.service';

@Injectable({
  providedIn: 'root',
})
export class LibraryService {

  readonly EXPORT_URL = '/api/export/library/';
  readonly LIBRARY_END_POINT = '/api/datatype-library/';
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

  loadOrInsertRepositoryFromDisplayInfo(documentInfo: IDocumentDisplayInfo<ILibrary>, load: boolean, values?: string[]): fromDam.InsertResourcesInRepostory | fromDam.LoadResourcesInRepostory {
    const _default = ['datatypes', 'valueSets', 'sections'];
    const collections = (values ? values : _default).map((key) => {
      return {
        key,
        values: key === 'sections' ? IgTOCNodeHelper.getIDisplayFromSections(documentInfo.ig.content, '') : documentInfo[key],
      };
    });

    return !load ? new fromDam.InsertResourcesInRepostory({
      collections,
    }) : new fromDam.LoadResourcesInRepostory({
      collections,
    });
  }

  loadRepositoryFromDisplayInfo(documentInfo: IDocumentDisplayInfo<ILibrary>, values?: string[]): Action {
    return this.loadOrInsertRepositoryFromDisplayInfo(documentInfo, true, values);
  }

  insertRepositoryFromDisplayInfo(igInfo: IDocumentDisplayInfo<ILibrary>, values?: string[]): Action {
    return this.loadOrInsertRepositoryFromDisplayInfo(igInfo, false, values);
  }

  insertRepositoryCopyResource(registryList: IRegistry, display: IDisplayElement, library: ILibrary): Action[] {
    const { registry, collection } = this.getRegistryAndCollectionByType(display.type);
    return [
      ...(registry ? [new fromDam.LoadPayloadData({
        ...library,
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

  deleteOneFromRepository(display: IDisplayElement, library: IDocument): Action[] {
    const { registry, collection } = this.getRegistryAndCollectionByType(display.type);
    return [
      ...(registry ? [new fromDam.LoadPayloadData({
        ...library,
        [registry]: this.removeById(library[registry], display.id),
      })] : []),
      ...(collection ? [new fromDam.DeleteResourcesFromRepostory({
        collections: [{
          key: collection,
          values: [display.id],
        }],
      })] : []),
    ];
  }

  updateSections(sections: IDisplayElement[], library: ILibrary): Action[] {
    const content: IContent[] = IgTOCNodeHelper.updateSections(sections);
    const sectionList: IDisplayElement[] = IgTOCNodeHelper.getIDisplayFromSections(content, '');
    return [
      new fromDam.LoadPayloadData({
        ...library,
        content,
      }),
      new fromDam.InsertResourcesInRepostory({
        collections: [{
          key: 'sections',
          values: sectionList,
        }],
      }),
      new TableOfContentSave({
        sections: content, id: library.id,
      }),
    ];
  }

  removeById(reg: IRegistry, id: string): IRegistry {
    return { ...reg, children: reg.children.filter((elm) => elm.id !== id) };
  }

  libraryToIDisplayElement(library: ILibrary): IDisplayElement {
    return {
      id: library.id,
      fixedName: library.metadata.title,
      variableName: library.metadata.subTitle,
      description: library.metadata.implementationNotes,
      domainInfo: library.domainInfo,
      type: Type.IGDOCUMENT,
      leaf: true,
      differential: !!library.origin,
      isExpanded: true,
    };
  }

  cloneIg(id: string, mode: CloneModeEnum, data: any): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.LIBRARY_END_POINT + id + '/clone', { mode, data }).pipe();
  }

  publish(id: string, publicationResult: IPublicationResult): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.LIBRARY_END_POINT + id + '/publish', publicationResult).pipe();
  }

  getPublicationSummary(id: string): Observable<IPublicationSummary> {
    return this.http.get<IPublicationSummary>(this.LIBRARY_END_POINT + id + '/publicationSummary', {}).pipe();
  }

  updateSharedUsers(sharedUsers: any, id: string): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.LIBRARY_END_POINT + id + '/updateSharedUser', sharedUsers).pipe();
  }
  create(wrapper: IDocumentCreationWrapper): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.LIBRARY_END_POINT + 'create/', wrapper);
  }

  getDisplayInfo(id: string): Observable<IDocumentDisplayInfo<ILibrary>> {
    console.log(this.LIBRARY_END_POINT + id + '/state');
    return this.http.get<IDocumentDisplayInfo<ILibrary>>(this.LIBRARY_END_POINT + id + '/state');
  }

  addResource(wrapper: IAddNodes): Observable<Message<IDocumentDisplayInfo<ILibrary>>> {
    return this.http.post<Message<IDocumentDisplayInfo<ILibrary>>>(this.buildAddingUrl(wrapper), wrapper);
  }
  buildAddingUrl(wrapper: IAddNodes): string {
    switch (wrapper.type) {
      case Type.DATATYPE:
        return this.LIBRARY_END_POINT + wrapper.documentId + '/datatypes/add';
      case Type.VALUESET:
        return this.LIBRARY_END_POINT + wrapper.documentId + '/valuesets/add';
      default: return null;
    }
  }

  copyResource(payload: ICopyNode) {
    return this.http.post<Message<ICopyResourceResponse>>(this.buildCopyUrl(payload), payload);
  }

  private buildCopyUrl(payload: ICopyNode) {
    switch (payload.selected.type) {
      case Type.DATATYPE:
        return this.LIBRARY_END_POINT + payload.documentId + '/datatypes/' + payload.selected.originalId + '/clone';
      case Type.VALUESET:
        return this.LIBRARY_END_POINT + payload.documentId + '/valuesets/' + payload.selected.originalId + '/clone';
      default: return null;
    }
  }

  private buildDeleteUrl(documentId: string, element: IDisplayElement) {
    return this.LIBRARY_END_POINT + documentId + '/datatypes/' + element.id + '/delete';
  }

  saveTextSection(id: string, narrative: INarrative): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.LIBRARY_END_POINT + id + '/section', narrative);
  }

  saveTextSections(id: string, content: IContent[]): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.LIBRARY_END_POINT + id + '/update/sections', content);
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
    return this.http.post<Message<string>>(this.LIBRARY_END_POINT + id + '/updatemetadata', metadata);
  }

  deleteResource(documentId: string, element: IDisplayElement): Observable<Message<any>> {
    const url = this.buildDeleteUrl(documentId, element);
    if (url != null) {
      return this.http.delete<Message<any>>(url);
    } else { throwError('Unsupported Url'); }
  }

  exportXML(libId: string, selectedIds: ISelectedIds, xmlFormat) {
    const form = document.createElement('form');
    form.action = this.EXPORT_URL + libId + '/xml/validation';
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

  exportAsWord(libId: string, decision: any, configurationId: string) {
    this.submitForm(decision, this.EXPORT_URL + libId + this.CONFIGURATION + configurationId + '/word');
  }

  export(libId, decision: any, format: string) {
    const form = document.createElement('form');
    form.action = this.EXPORT_URL + libId + '/' + format;
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

  exportAsHtml(libId: string, decision: any, configurationId: string) {
    this.submitForm(decision, this.EXPORT_URL + libId + this.CONFIGURATION + configurationId + '/html');
  }

  exportAsHtmlQuick(libId: string) {
    this.submitForm(null, this.EXPORT_URL + libId + '/quickHtml');
  }

  exportAsWordQuick(libId: string) {
    this.submitForm(null, this.EXPORT_URL + libId + '/quickWord');
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

  private prepareUrl(libId: string, type: string): string {
    return this.location.prepareExternalUrl('api/export/datatype-library/' + libId + '/export/' + type).replace('#', '');
  }

  getExportFirstDecision = (libId: string, conflibId: string): Observable<IExportConfigurationGlobal> => {
    return this.http.get<IExportConfigurationGlobal>(this.EXPORT_URL + libId + this.CONFIGURATION + conflibId + '/getFilteredDocument');
  }

getLastUserConfiguration = (libId: string): Observable<IExportConfigurationGlobal> => {
    return this.http.get<IExportConfigurationGlobal>(this.EXPORT_URL + libId +   '/getLastUserConfiguration');
  }
  getDisplay(id: string, delta: boolean) {
      return this.getDisplayInfo(id);
  }
}
