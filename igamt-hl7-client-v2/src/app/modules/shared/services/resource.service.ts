import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Message} from '../../core/models/message/message.class';
import {Type} from '../constants/type.enum';
import {IResourceInfo} from '../models/resource-info.interface';
import {IResource} from '../models/resource.interface';

@Injectable({
  providedIn: 'root',
})
export class ResourceService {

  resource = '/resources';
  constructor(private http: HttpClient) {}

  importResource(payload: IResourceInfo): Observable<Message<any[]>> {
   return this.http.get<Message<any[]>> (this.getImportUrl(payload));
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

  getDependencies(id: string, type: Type) {
    return this.http.get<Message<IResource[]>> (this.getDependenciesURl(type, id));
  }

  private getDependenciesURl(type: Type, id: string) {
    switch (type) {
      case Type.CONFORMANCEPROFILE:
        return 'api/conformanceprofiles/' + id + this.resource;
      case Type.DATATYPE:
        return 'api/datatypes/' + id + this.resource;
      case Type.SEGMENT:
        return 'api/segments/' + id + this.resource;
      default: return null;
    }
  }
}
