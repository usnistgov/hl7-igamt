import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Message} from '../../core/models/message/message.class';
import {
  DocumentationScope,
  DocumentationType,
  IDocumentation,
  IDocumentationWrapper,
} from '../models/documentation.interface';

@Injectable({
  providedIn: 'root',
})
export class DocumentationService {

  constructor(private http: HttpClient) {}

  getDocumentation(): Observable<IDocumentationWrapper > {
    const wrapper: IDocumentationWrapper = {};
    wrapper.userguides = [{type: DocumentationType.USERGUIDE, description: 'eee', label: 'label', id: '1', scope: DocumentationScope.GLOBAL},
      {type: DocumentationType.USERGUIDE, description: 'eee', label: 'label2', id: '2', scope: DocumentationScope.GLOBAL}];
    return of(wrapper);
  }

  findSectionByTypeAndName(id: string, type: string, docs: IDocumentationWrapper): IDocumentation {

    if (type === DocumentationType.USERGUIDE.toString()) {
      return docs.userguides.find((x: IDocumentation ) => id === x.id);
    } else if (type === DocumentationType.IMPLEMENTATIONDECISION.toString()) {
      return docs.implementationDecesions.find((x: IDocumentation ) => id === x.id);
    } else if (type === DocumentationType.RELEASENOTE.toString()) {
      return docs.releaseNotes.find((x: IDocumentation ) => id === x.label);
    }
  }

  getAllDocumentations(): Observable<IDocumentation[]> {
    return this.http.get<IDocumentation[]>('api/documentations/getAll');
  }

  updateList(list: IDocumentation[]): Observable<IDocumentation[]> {
    return this.http.post<IDocumentation[]>('api/documentations/updateList', list);
  }

  save(documentation: IDocumentation): Observable<IDocumentation> {
    return this.http.post<IDocumentation>( 'api/documentations/save', documentation);
  }
  delete(id: string, list: IDocumentation[]): Observable<IDocumentation[]> {
    return this.http.post<IDocumentation[]>( '/api/documentations/delete/' + id, list);
  }
  add(documentationType: DocumentationType, index: number): Observable<IDocumentation> {
    return this.http.post<IDocumentation>( 'api/documentations/add/', {documentationType, index});
  }
}
