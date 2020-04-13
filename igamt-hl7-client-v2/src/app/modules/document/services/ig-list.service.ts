import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IgListLoad} from '../../../root-store/document/document-list/document-list.actions';
import {IDocumentType} from '../document.type';
import {IgListItem} from '../models/ig/ig-list-item.class';
import {Message} from './../../core/models/message/message.class';
import {DocumentAdapterService} from './document-adapter.service';

@Injectable({
  providedIn: 'root',
})
export class IgListService {

  constructor(private http: HttpClient, private documentAdapterService: DocumentAdapterService) {
  }

  loadTypeToAPI(type: IgListLoad): 'PRIVATE' | 'PUBLIC' | 'ALL' {
    switch (type) {
      case 'USER':
        return 'PRIVATE';
      case 'PUBLISHED':
        return 'PUBLIC';
      case 'ALL':
        return 'ALL';
    }
  }

  fetchIgList(type: IgListLoad, documentType: IDocumentType): Observable<IgListItem[]> {
    return this.http.get<IgListItem[]>( this.documentAdapterService.getEndPoint(documentType.type, documentType.scope), {
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

  deleteIg(id: string, documentType: IDocumentType) {
    return this.http.delete<Message>('api/igdocuments/' + id);
  }
}
