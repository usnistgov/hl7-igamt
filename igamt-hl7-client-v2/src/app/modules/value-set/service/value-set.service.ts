import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../../dam-framework/models/messages/message.class';
import { IDocumentRef } from '../../shared/models/abstract-domain.interface';
import { IChange } from '../../shared/models/save-change';
import { IValueSet } from '../../shared/models/value-set.interface';

@Injectable({
  providedIn: 'root',
})
export class ValueSetService {

  constructor(private http: HttpClient) { }

  getById({ documentId, type }: IDocumentRef, id: string): Observable<IValueSet> {
    return this.http.get<IValueSet>('api/igdocuments/' + documentId + '/valueset/' + id);
  }

  saveChanges(id: string, { documentId, type }: IDocumentRef, changes: IChange[]): Observable<Message<string>> {
    return this.http.post<Message<string>>('api/valuesets/' + id, changes, {
      params: {
        dId: documentId,
      },
    });
  }

  exportCSVFile(vsId: string) {
    const form = document.createElement('form');
    form.action = 'api/valuesets/exportCSV/' + vsId;
    form.method = 'POST';
    form.style.display = 'none';
    document.body.appendChild(form);
    form.submit();
  }

  exportCodeCSVFile(vsId: string) {
    const form = document.createElement('form');
    form.action = 'api/valuesets/export-code-csv/' + vsId;
    form.method = 'POST';
    form.style.display = 'none';
    document.body.appendChild(form);
    form.submit();
  }

}
