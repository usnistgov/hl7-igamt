import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../../core/models/message/message.class';
import { IConformanceStatementList } from '../../shared/models/cs-list.interface';
import { IChange } from '../../shared/models/save-change';
import { ISegment } from '../../shared/models/segment.interface';

@Injectable()
export class SegmentService {

  readonly URL = 'api/segments/';

  constructor(private http: HttpClient) { }

  getById(id: string): Observable<ISegment> {
    return this.http.get<ISegment>(this.URL + id);
  }

  getSegmentConformanceStatements(id: string, documentId: string): Observable<IConformanceStatementList> {
    return this.http.get<IConformanceStatementList>(this.URL + id + '/conformancestatement/' + documentId);
  }

  saveChanges(id: string, documentId: string, changes: IChange[]): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.URL + id, changes, {
      params: {
        dId: documentId,
      },
    });
  }
}
