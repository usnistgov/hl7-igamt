import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../../dam-framework/models/messages/message.class';
import { IDocumentRef } from '../../shared/models/abstract-domain.interface';
import { IConformanceStatementList } from '../../shared/models/cs-list.interface';
import { IDatatype } from '../../shared/models/datatype.interface';
import { IChange } from '../../shared/models/save-change';

@Injectable()
export class DatatypeService {

  readonly URL = 'api/datatypes/';

  constructor(private http: HttpClient) { }

  getById(id: string): Observable<IDatatype> {
    return this.http.get<IDatatype>(this.URL + id);
  }

  saveChanges(id: string, documentRef: IDocumentRef, changes: IChange[]): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.URL + id, changes, {
      params: {
        dId: documentRef.documentId,
      },
    });
  }

  getConformanceStatements(id: string, documentInfo: IDocumentRef): Observable<IConformanceStatementList> {
    return this.http.get<IConformanceStatementList>(this.URL + id + '/conformancestatement/' + documentInfo.documentId);
  }

}
