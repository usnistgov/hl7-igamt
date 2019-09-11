import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../../core/models/message/message.class';
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

  saveChanges(id: string, documentId: string, changes: IChange[]): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.URL + id, changes, {
      params: {
        dId: documentId,
      },
    });
  }

  getConformanceStatements(id: string, documentId: string): Observable<IConformanceStatementList> {
    return this.http.get<IConformanceStatementList>(this.URL + id + '/conformancestatement/' + documentId);
  }

}
