import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../../core/models/message/message.class';
import { IChange } from '../../shared/models/save-change';
import { IValueSet } from '../../shared/models/value-set.interface';
@Injectable({
  providedIn: 'root',
})
export class ValueSetService {

  constructor(private http: HttpClient) { }

  getById(igId: string, id: string): Observable<IValueSet> {
    return this.http.get<IValueSet>('api/igdocuments/' + igId + '/valueset/' + id);
  }

  saveChanges(id: string, documentId: string, changes: IChange[]): Observable<Message<string>> {
    return this.http.post<Message<string>>('api/valuesets/' + id, changes, {
      params: {
        dId: documentId,
      },
    });
  }
}
