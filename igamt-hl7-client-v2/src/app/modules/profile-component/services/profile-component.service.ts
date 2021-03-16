import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IProfileComponent,
  IProfileComponentContext,
  IItemProperty,
} from '../../shared/models/profile.component';
import { IChange } from '../../shared/models/save-change';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class ProfileComponentService {

  readonly URL = 'api/profile-component/';

  constructor(private http: HttpClient) { }

  getById(id: string): Observable<IProfileComponent> {
    return this.http.get<IProfileComponent>(this.URL + id);
  }

  getChildById(pcId: string, id: string): Observable<IProfileComponentContext> {
    return this.http.get<IProfileComponentContext>(this.URL + pcId + '/context/' + id);
  }

  saveContext(pcId: string, context: IProfileComponentContext): Observable<IProfileComponentContext> {
    console.log(context);
    return this.http.post<IProfileComponentContext>(this.URL + pcId + '/context/' + context.id + '/update', context.profileComponentItems);
  }

  applyChange(change: IChange<IItemProperty>, context: IProfileComponentContext) {
    const item = context.profileComponentItems.find((elm) => elm.path === change.location);
    if (item) {
      const propId = item.itemProperties.findIndex((prop) => prop.propertyKey === change.propertyType);
      if (propId === -1) {
        item.itemProperties = [
          ...item.itemProperties,
          change.propertyValue,
        ];
      } else {
        item.itemProperties = [
          ...item.itemProperties.splice(propId, 1),
          change.propertyValue
        ];
      }
    }
  }

}
