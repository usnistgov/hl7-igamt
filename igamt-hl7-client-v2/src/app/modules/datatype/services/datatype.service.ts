import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../../core/models/message/message.class';
import { IDatatype } from '../../shared/models/datatype.interface';
import { IChange } from '../../shared/models/save-change';

@Injectable()
export class DatatypeService {

  constructor(private http: HttpClient) { }

  getById(id: string): Observable<IDatatype> {
    return this.http.get<IDatatype>('api/datatypes/' + id);
  }

  saveChanges(id: string, documentId: string, changes: IChange[]): Observable<Message<string>> {
    return this.http.post<Message<string>>('api/datatypes/' + id, changes, {
      params: {
        dId: documentId,
      },
    });
  }
}
