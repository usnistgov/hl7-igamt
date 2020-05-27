import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Message } from '../../dam-framework/models/messages/message.class';
import {IgListItem} from '../../document/models/document/ig-list-item.class';
import { LibraryListLoad } from './../../../root-store/library/library-list/library-list.actions';

@Injectable({
  providedIn: 'root',
})
export class LibraryListService {

  constructor(private http: HttpClient) {
  }

  loadTypeToAPI(type: LibraryListLoad) {
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

  fetchLibraryList(type: LibraryListLoad): Observable<IgListItem[]> {
    return this.http.get<IgListItem[]>('api/datatype-library', {
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

  deleteLibrary(id: string) {
    return this.http.delete<Message>('api/datatype-library/' + id);
  }
}
