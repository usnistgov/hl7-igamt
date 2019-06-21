import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../../core/models/message/message.class';
import { IChange } from '../../shared/models/save-change';
import { ISegment } from '../../shared/models/segment.interface';

@Injectable()
export class SegmentService {

  constructor(private http: HttpClient) { }

  getById(id: string): Observable<ISegment> {
    return this.http.get<ISegment>('api/segments/' + id);
  }

  saveChanges(id: string, documentId: string, changes: IChange[]): Observable<Message<string>> {
    return this.http.post<Message<string>>('api/segments/' + id, changes, {
      params: {
        dId: documentId,
      },
    });
  }
}
