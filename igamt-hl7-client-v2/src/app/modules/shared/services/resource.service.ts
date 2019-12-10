import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { UserMessage } from 'src/app/modules/core/models/message/message.class';
import { Message, MessageType } from '../../core/models/message/message.class';
import { Scope } from '../constants/scope.enum';
import { Type } from '../constants/type.enum';
import { IResourceInfo } from '../models/resource-info.interface';
import { IResource } from '../models/resource.interface';

@Injectable({
  providedIn: 'root',
})
export class ResourceService {

  resource = '/resources';
  constructor(private http: HttpClient) { }

  importResource(payload: IResourceInfo): Observable<Message<any[]>> {
    return this.http.get<Message<any[]>>(this.getImportUrl(payload));
  }

  private getImportUrl(info: IResourceInfo): string {
    switch (info.type) {
      case Type.EVENTS:
        return 'api/igdocuments/findMessageEvents/' + info.version;
      case Type.DATATYPE:
        return 'api/datatypes/' + info.scope + '/' + info.version;
      case Type.SEGMENT:
        return 'api/segments/' + info.scope + '/' + info.version;
      case Type.VALUESET:
        if (info.scope !== Scope.PHINVADS) {
          return 'api/valuesets/' + info.scope + '/' + info.version;
        } else {
          return 'api/valuesets/' + info.scope + '/info';
        }
    }
  }

  getResources(id: string, type: Type, documentId: string): Observable<IResource[]> {
    const url = this.getResourcesUrl(type, id, documentId);
    if (url) {
      return this.http.get<IResource[]>(url);
    } else {
      return throwError(new UserMessage(MessageType.FAILED, 'Unrecognized resource type'));
    }
  }

  private getResourcesUrl(type: Type, id: string, documentId: string): string {
    switch (type) {
      case Type.CONFORMANCEPROFILE:
        return 'api/conformanceprofiles/' + id + this.resource;
      case Type.DATATYPE:
        return 'api/datatypes/' + id + this.resource;
      case Type.SEGMENT:
        return 'api/segments/' + id + this.resource;
      case Type.VALUESET:
        return 'api/igdocuments/' + documentId + '/valueset/' + id + '/resource';
      case Type.COCONSTRAINTGROUP:
        return '/api/coconstraints/group/' + id + '/resources';
      default: return null;
    }
  }
}
