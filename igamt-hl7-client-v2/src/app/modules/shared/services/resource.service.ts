import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Message} from '../../core/models/message/message.class';
import {Type} from '../constants/type.enum';
import {IResourceInfo} from '../models/resource-info.interface';

@Injectable({
  providedIn: 'root',
})
export class ResourceService {

  constructor(private http: HttpClient) {}

  getResource(payload: IResourceInfo): Observable<Message<any[]>> {
   return this.http.get<Message<any[]>> (this.buildURL(payload));
  }
  private buildURL(info: IResourceInfo): string {
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
}
