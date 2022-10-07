import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMessage } from '../../dam-framework/models/messages/message.class';
import { Scope } from '../../shared/constants/scope.enum';
import { Type } from '../../shared/constants/type.enum';
import { IMessageStructure, IMsgStructElement } from '../../shared/models/conformance-profile.interface';
import { IUsages } from '../../shared/models/cross-reference';
import { IDisplayElement } from '../../shared/models/display-element.interface';
import { IResource } from '../../shared/models/resource.interface';
import { IField, ISegment } from '../../shared/models/segment.interface';
import { IMessageStructureMetadata } from '../components/message-metadata-editor/message-metadata-editor.component';
import { ISegmentStructureMetadata } from '../components/segment-metadata-editor/segment-metadata-editor.component';
import {
  ICreateMessageStructure,
  ICreateSegmentStructure,
  ICustomStructureRegistry,
  IMessageStructureAndDisplay,
  ISegmentStructureAndDisplay,
} from '../domain/structure-editor.model';

export interface IMessageStructureState {
  structure: IMessageStructure;
  resources: IResource[];
  segments: IDisplayElement[];
  datatypes: IDisplayElement[];
  valuesets: IDisplayElement[];
}

export interface ISegmentState {
  structure: ISegment;
  resources: IResource[];
  datatypes: IDisplayElement[];
  valuesets: IDisplayElement[];
}

@Injectable({
  providedIn: 'root',
})
export class StructureEditorService {

  constructor(private http: HttpClient) { }

  getRegistry(): Observable<ICustomStructureRegistry> {
    return this.http.get<ICustomStructureRegistry>('api/structure-editor/structures');
  }

  getResourcesDisplay(type: Type, version: string, scope: Scope): Observable<IDisplayElement[]> {
    return this.http.get<IDisplayElement[]>(`/api/structure-editor/structure/resources/${type}/${scope}/${version}`);
  }

  getMessageStructureById(id: string): Observable<IMessageStructure> {
    return this.http.get<IMessageStructure>('api/structure-editor/structures/' + id);
  }

  getSegmentById(id: string): Observable<ISegment> {
    return this.http.get<ISegment>('api/structure-editor/segments/' + id);
  }

  getMessageStructureStateById(id: string): Observable<IMessageStructureState> {
    return this.http.get<IMessageStructureState>('api/structure-editor/structure/' + id + '/state');
  }

  getSegmentStateById(id: string): Observable<ISegmentState> {
    return this.http.get<ISegmentState>('api/structure-editor/segment/' + id + '/state');
  }

  getResourceValueSets(type: Type, id: string): Observable<IDisplayElement[]> {
    return this.http.get<IDisplayElement[]>(`/api/structure-editor/valueSets/${type}/${id}`);
  }

  createMessageStructure(request: ICreateMessageStructure): Observable<IMessageStructureAndDisplay> {
    return this.http.post<IMessageStructureAndDisplay>('api/structure-editor/structure', request);
  }

  createSegmentStructure(request: ICreateSegmentStructure): Observable<ISegmentStructureAndDisplay> {
    return this.http.post<ISegmentStructureAndDisplay>('api/structure-editor/segment', request);
  }

  saveMessageStructure(id: string, structure: IMsgStructElement[]): Observable<IMessage<string>> {
    return this.http.post<IMessage<string>>(`api/structure-editor/structure/${id}/save`, structure);
  }

  saveMessageStructureMetadata(id: string, metadata: IMessageStructureMetadata): Observable<IMessage<string>> {
    return this.http.post<IMessage<string>>(`api/structure-editor/structure/${id}/metadata/save`, metadata);
  }

  saveSegmentStructure(id: string, structure: IField[]): Observable<IMessage<string>> {
    return this.http.post<IMessage<string>>(`api/structure-editor/segment/${id}/save`, structure);
  }

  saveSegmentMetadata(id: string, metadata: ISegmentStructureMetadata): Observable<IMessage<string>> {
    return this.http.post<IMessage<string>>(`api/structure-editor/segment/${id}/metadata/save`, metadata);
  }

  publishSegment(id: string): Observable<IMessage<ISegmentStructureAndDisplay>> {
    return this.http.get<IMessage<ISegmentStructureAndDisplay>>(`api/structure-editor/segment/${id}/publish`);
  }

  publishMessageStructure(id: string): Observable<IMessage<IMessageStructureAndDisplay>> {
    return this.http.get<IMessage<IMessageStructureAndDisplay>>(`api/structure-editor/structure/${id}/publish`);
  }

  deleteMessageStructure(id: string): Observable<IMessage<string>> {
    return this.http.delete<IMessage<string>>(`api/structure-editor/structure/${id}`);
  }

  deleteSegmentStructure(id: string): Observable<IMessage<string>> {
    return this.http.delete<IMessage<string>>(`api/structure-editor/segment/${id}`);
  }

  getSegmentCrossRefs(id: string): Observable<IUsages[]> {
    return this.http.get<IUsages[]>(`api/structure-editor/segment/${id}/cross-references`);
  }

  getMessageMetadata(ms: IMessageStructure): IMessageStructureMetadata {
    return {
      structId: ms.structID,
      messageType: ms.messageType,
      hl7Version: ms.domainInfo.version,
      description: ms.description,
      events: ms.events,
    };
  }

  getSegmentMetadata(ss: ISegment): ISegmentStructureMetadata {
    return {
      description: ss.description,
      identifier: ss.ext,
      hl7Version: ss.domainInfo.version,
      name: ss.name,
    };
  }
}
