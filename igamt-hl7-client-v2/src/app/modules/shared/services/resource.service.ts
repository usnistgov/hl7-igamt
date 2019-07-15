import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { UserMessage } from 'src/app/modules/core/models/message/message.class';
import { Message, MessageType } from '../../core/models/message/message.class';
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
        return 'api/valuesets/' + info.scope + '/' + info.version;
    }
  }

  getResources(id: string, type: Type): Observable<IResource[]> {
    const url = this.getResourcesUrl(type, id);
    if (url) {
      return this.http.get<IResource[]>(url);
    } else {
      return throwError(new UserMessage(MessageType.FAILED, 'Unrecognized resource type'));
    }
  }

  private getResourcesUrl(type: Type, id: string): string {
    switch (type) {
      case Type.CONFORMANCEPROFILE:
        return 'api/conformanceprofiles/' + id + this.resource;
      case Type.DATATYPE:
        return 'api/datatypes/' + id + this.resource;
      case Type.SEGMENT:
        return 'api/segments/' + id + this.resource;
      case Type.VALUESET:
        return 'api/valuesets/' + id + this.resource;
      default: return null;
    }
  }
}
