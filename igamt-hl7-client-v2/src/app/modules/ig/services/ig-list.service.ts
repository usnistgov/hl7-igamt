import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Message } from '../../dam-framework/models/messages/message.class';
import { IgListItem } from '../models/ig/ig-list-item.class';
import { IgListLoad } from './../../../root-store/ig/ig-list/ig-list.actions';

@Injectable({
  providedIn: 'root',
})
export class IgListService {

  constructor(private http: HttpClient) {
  }

  loadTypeToAPI(type: IgListLoad) {
    switch (type) {
      case 'USER':
        return 'PRIVATE';
      case 'PUBLISHED':
        return 'PUBLIC';
      case 'SHARED':
        return 'SHARED';
      case 'ALL':
        return 'ALL';
    }
  }

  fetchIgList(type: IgListLoad): Observable<IgListItem[]> {
    return this.http.get<IgListItem[]>('api/igdocuments', {
      params: {
        type: this.loadTypeToAPI(type),
      },
    }).pipe(
      map((list) => {
        return list.map(
          (item) => {
            item.type = type === 'ALL' ? 'USER' : type;
            return item;
          },
        );
      }),
    );
  }

  deleteIg(id: string) {
    return this.http.delete<Message>('api/igdocuments/' + id);
  }
}
